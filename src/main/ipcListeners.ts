import { ipcMain, shell } from 'electron';
import fsPromises from 'fs/promises';
import fs, { WriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { pipeline } from 'stream';
import { Blocks, FileJson } from 'types';
import { BACKEND } from '../utils/constants';
import { resolvePath } from '../utils/paths';
import { systemPreferences } from '../utils/storage';
import { Logger } from '../utils/logger';

const fileToJson = async (fileName: string): Promise<FileJson> => {
  const buff = await fsPromises.readFile(fileName);
  const str = buff.toString();
  const json = JSON.parse(str);
  return json;
};

const jsonToFile = async (fileName: string, data: FileJson) => {
  await fsPromises.writeFile(fileName, JSON.stringify(data));
};

export const ipcListeners = () => {
  const logger = new Logger();
  let writePath: string;

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

  ipcMain.on('saveFile', async (event, blocks: Blocks) => {
    const json = await fileToJson(writePath);
    const newJson: FileJson = {
      ...json,
      blocks,
    };
    jsonToFile(writePath, newJson);
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
      await jsonToFile(fileName, data);
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

      const json = await fileToJson(newFileName);
      await jsonToFile(newFileName, { ...json, title: newTitle });
      event.reply('renamedFile', id);
    }
  );

  ipcMain.on('selectFile', async (event, name) => {
    const fileName = resolvePath([`${name}.json`]);
    const json = await fileToJson(fileName);
    event.reply('selectFile', json);
    writePath = fileName;
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
