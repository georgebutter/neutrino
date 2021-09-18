/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from "electron-store";
import MenuBuilder from './menu';
import { resolveHtmlPath, storeConfig } from './util';
import { URL } from 'url';
import fetch from 'electron-fetch';
import { exec } from 'child_process';
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });
const store = new Store(storeConfig)
const githubOptions = {
  clientId: 'b41b62ee84a3c26f79fd',
  clientSecret: '597fa6815153f63728b93b08cfe94720aae43ade',
  scopes: [
    'user',
    'repo',
    'repo:status',
    'read:repo_hook',
    'read:org',
    'read:public_key',
    'read:gpg_key',
  ],
}

ipcMain.on('login', async () => {
  const { clientId, scopes } = githubOptions;
  /** Generate a new window with the github login form */
  const authUrl = new URL('https://github.com/login/oauth/authorize')
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('scope', scopes.toString());
  authUrl.searchParams.append('redirect_uri', resolveHtmlPath('auth'));

  if (mainWindow) {
    mainWindow.loadURL(authUrl.toString());
    mainWindow.show();
  }
})

ipcMain.on('logout', (event) => {
  store.delete('token');
  event.reply('logout');
})

ipcMain.on('authenticate', async (event, code) => {
  const { clientId, clientSecret } = githubOptions;
  const tokenUrl = new URL('https://github.com/login/oauth/access_token')
  tokenUrl.searchParams.append('client_id', clientId);
  tokenUrl.searchParams.append('client_secret', clientSecret);
  tokenUrl.searchParams.append('code', code);
  tokenUrl.searchParams.append('redirect_uri', resolveHtmlPath('auth'));

  const res = await fetch(tokenUrl.toString(), {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  });
  const { access_token } = await res.json();
  store.set("token", access_token);
  event.reply('authenticated', access_token);
})

ipcMain.on('token', (event) => {
  const token = store.get('token');
  event.reply('token', token);
})

ipcMain.on('newFile', (event, name) => {
  console.log('newFile')
  console.log(name)
  exec(`
    cd repo
    touch ${name}.md
  `, (err, stdout) => {
    console.log(stdout)
    event.reply('newFile')
  })
})

ipcMain.on('getFileTree', (event) => {
  console.log("getting file tree")
  fs.readdir(`${process.cwd()}/repo`, (err, files) => {
    event.reply('getFileTree', files.filter((f) => f !== ".git").map((f) => f.replace('.md', '')));
  })
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { width, height } = store.get("windowBounds");

  mainWindow = new BrowserWindow({
    hasShadow: true,
    title: "Neutrino",
    width,
    height,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      const init = store.get('init');
      if (!init) {
        exec(`
          mkdir repo
          cd repo
          git init -q
        `);
        store.set('init', true);
      }
      store.reset('init');
      mainWindow.maximize();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('resize', () => {
    if (mainWindow) {
      const { width, height } = mainWindow.getBounds();
      store.set("windowBounds", { width, height });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
