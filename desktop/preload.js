const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('KNOWLY_DESKTOP', true);
