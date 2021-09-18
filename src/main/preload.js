const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');

contextBridge.exposeInMainWorld('electron', {
  login: () => ipcRenderer.send('login'),
  logout: () => ipcRenderer.send('logout'),
  getFileTree: () => ipcRenderer.send('getFileTree'),
  authenticate: (code) => ipcRenderer.send('authenticate', code),
  newFile: (name) => ipcRenderer.send('newFile', name),
  getToken: (code) => ipcRenderer.send('token'),
  ipcRenderer: {
    on(channel, func) {
      const validChannels = ['token', 'getFileTree', 'authenticated', 'logout', 'newFile'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
