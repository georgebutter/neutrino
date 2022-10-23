import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  login: () => ipcRenderer.send('login'),
  logout: () => ipcRenderer.send('logout'),
  getFileTree: () => ipcRenderer.send('getFileTree'),
  // authenticate: (code) => ipcRenderer.send('authenticate', code),
  newFile: (name: string) => ipcRenderer.send('newFile', name),
  renameFile: (id: string, oldName: string, newName: string) => ipcRenderer.send('renameFile', id, oldName, newName),
  deleteFile: (name:string) => ipcRenderer.send('deleteFile', name),
  selectFile: (name: string) => ipcRenderer.send('selectFile', name),
  getToken: (code: string) => ipcRenderer.send('token'),
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
