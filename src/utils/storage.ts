import Store from 'electron-store';

export const systemPreferences = new Store({
  defaults: {
    windowBounds: { width: 800, height: 600 },
    token: '',
    init: false,
  },
  encryptionKey: 'e984f3f165438ccf1c72',
});
