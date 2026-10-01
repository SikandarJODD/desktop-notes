const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
	getVersion: () => ipcRenderer.invoke('app:get-version'),
	app: {
			onBeforeClose: (callback) => {
			const listener = () => void callback();
			ipcRenderer.on('app:before-close', listener);
			return () => ipcRenderer.removeListener('app:before-close', listener);
		},
		closeReady: () => ipcRenderer.send('app:close-ready'),
		closeCancelled: () => ipcRenderer.send('app:close-cancelled')
	},
	notes: {
		list: () => ipcRenderer.invoke('notes:list'),
		get: (id) => ipcRenderer.invoke('notes:get', id),
		create: (input) => ipcRenderer.invoke('notes:create', input),
		update: (id, input) => ipcRenderer.invoke('notes:update', id, input),
		delete: (id) => ipcRenderer.invoke('notes:delete', id)
	}
});
