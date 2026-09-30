const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
	getVersion: () => ipcRenderer.invoke('app:get-version'),
});
