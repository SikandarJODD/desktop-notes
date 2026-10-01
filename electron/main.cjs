const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const {
	openDatabase,
	closeDatabase,
	listNotes,
	getNote,
	createNote,
	updateNote,
	deleteNote
} = require('./database.cjs');

const iconPath = path.join(__dirname, 'assets', 'icon.png');
const closePendingWindows = new WeakSet();
const closeReadyWindows = new WeakSet();

function createWindow() {
	const win = new BrowserWindow({
		width: 1000,
		height: 700,
		title: 'Bhide Notes App',
		accentColor: '#000000',
		icon: iconPath,

		webPreferences: {
			preload: path.join(__dirname, 'preload.cjs'),
			contextIsolation: true,
			nodeIntegration: false
		}
	});

	win.on('close', (event) => {
		if (closeReadyWindows.has(win)) return;

		event.preventDefault();
		closePendingWindows.add(win);
		win.webContents.send('app:before-close');
	});

	if (!app.isPackaged) {
		win.loadURL('http://localhost:5173');
	} else {
		win.loadFile(path.join(__dirname, '../build/index.html'));
	}
}

app.whenReady().then(() => {
	openDatabase(path.join(app.getPath('userData'), 'notes.sqlite3'));

	ipcMain.handle('app:get-version', () => app.getVersion());
	ipcMain.handle('notes:list', () => listNotes());
	ipcMain.handle('notes:get', (_event, id) => getNote(id));
	ipcMain.handle('notes:create', (_event, input) => createNote(input));
	ipcMain.handle('notes:update', (_event, id, input) => updateNote(id, input));
	ipcMain.handle('notes:delete', (_event, id) => deleteNote(id));
	ipcMain.on('app:close-ready', (event) => {
		const win = BrowserWindow.fromWebContents(event.sender);
		if (!win || !closePendingWindows.has(win)) return;

		closePendingWindows.delete(win);
		closeReadyWindows.add(win);
		win.close();
	});
	ipcMain.on('app:close-cancelled', (event) => {
		const win = BrowserWindow.fromWebContents(event.sender);
		if (win) closePendingWindows.delete(win);
	});

	if (process.platform === 'darwin') {
		app.dock.setIcon(iconPath);
	}

	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('will-quit', closeDatabase);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
