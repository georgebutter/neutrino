import { BrowserWindow } from 'electron';
import contextMenu from 'electron-context-menu';
import fs from 'fs';
import { Maybe } from '../utils/maybe';
import { resolvePath } from '../utils/paths';

export function createContextMenu(mainWindow: Maybe<BrowserWindow>) {
  contextMenu({
    showSaveImageAs: true,
    prepend: (defaultActions, parameters, browserWindow) => [
      {
        label: 'Rename',
        // Only show it when right-clicking elements with title attrs
        visible: parameters.titleText.startsWith('name:'),
        click: () => {
          mainWindow?.webContents.send('renameFile', parameters.titleText);
        },
      },
      {
        label: 'Delete',
        // Only show it when right-clicking elements with title attrs
        visible: parameters.titleText.startsWith('name:'),
        click: () => {
          fs.unlink(
            resolvePath([`/${parameters.titleText.split(':')[1]}.json`]),
            () => {
              mainWindow?.webContents.send('deleteFile');
            }
          );
        },
      },
    ],
  });
}
