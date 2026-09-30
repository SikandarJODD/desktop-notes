const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
	getVersion: () => ipcRenderer.invoke('app:get-version'),
	notes: {
		list: () => ipcRenderer.invoke('notes:list'),
		get: (id) => ipcRenderer.invoke('notes:get', id),
		create: (input) => ipcRenderer.invoke('notes:create', input),
		update: (id, input) => ipcRenderer.invoke('notes:update', id, input),
		delete: (id) => ipcRenderer.invoke('notes:delete', id)
	}
});
