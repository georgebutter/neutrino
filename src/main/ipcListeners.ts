import { ipcMain, shell } from 'electron';
import fsPromises from 'fs/promises';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { BACKEND } from '../utils/constants';
import { resolvePath } from '../utils/paths';
import { systemPreferences } from '../utils/storage';
import { Logger } from '../utils/logger';

export const ipcListeners = () => {
  const logger = new Logger();
  /**
   * Initializes the login flow
   */
  ipcMain.on('login', async () => {
    const authUrl = new URL(`${BACKEND}/github/login`);

    shell.openExternal(authUrl.toString());
  });

  ipcMain.on('logout', (event) => {
    systemPreferences.delete('token');
    event.reply('logout');
  });

  ipcMain.on('saveFile', (event, id) => {
    const filePath = resolvePath([`${id}.json`]);
    // TODO
    event.reply('saveFile');
  });

  ipcMain.on('token', (event) => {
    const token = systemPreferences.get('token');
    event.reply('token', token);
  });

  ipcMain.on('newFile', async (event, title) => {
    try {
      const id = uuidv4();
      const fileName = resolvePath([`${id}.${title}.json`]);
      const data = {
        id,
        title,
        blocks: [],
      };
      await fsPromises.writeFile(fileName, JSON.stringify(data));
      event.reply('newFile', id);
    } catch (e) {
      event.reply('error', e);
    }
  });

  ipcMain.on(
    'renameFile',
    async (event, id: string, oldTitle: string, newTitle: string) => {
      logger.log(newTitle);
      const oldFileName = resolvePath([`${id}.${oldTitle}.json`]);
      const newFileName = resolvePath([`${id}.${newTitle}.json`]);
      fsPromises.rename(oldFileName, newFileName);

      const buff = await fsPromises.readFile(newFileName);
      const str = buff.toString();
      const json = JSON.parse(str);
      await fsPromises.writeFile(
        newFileName,
        JSON.stringify({ ...json, title: newTitle })
      );

      event.reply('renamedFile', id);
    }
  );

  ipcMain.on('selectFile', async (event, name) => {
    const fileName = resolvePath([`${name}.json`]);
    const buff = await fsPromises.readFile(fileName);
    const json = buff.toString();

    event.reply('selectFile', json);
  });

  ipcMain.on('deleteFile', (event, name) => {
    fs.unlink(resolvePath([`/${name}.json`]), () => {
      event.reply('deleteFile');
    });
  });

  ipcMain.on('getFileTree', (event) => {
    fs.readdir(resolvePath(), (err, files) => {
      const portableTextFiles = files
        ? files.filter((f) => f.endsWith('.json'))
        : [];
      const names = portableTextFiles.map((fileName) => {
        const [id, title] = fileName.split('.');
        return { id, title };
      });
      event.reply('getFileTree', names);
    });
  });
};
