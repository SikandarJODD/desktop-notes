const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');


function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,

        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '../build/index.html'));
    }
}

app.whenReady().then(() => {
    ipcMain.handle('app:get-version', () => {
        return app.getVersion();
    });
    // registerTodoHandlers();

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
