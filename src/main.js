const { app, BrowserWindow, Menu, MenuItem } = require('electron');
let mainWindow;
let menu = new Menu();

if(!app.requestSingleInstanceLock()) app.quit();
app.allowRendererProcessReuse = false;
menu.append(new MenuItem({ label: 'Change Source', accelerator: 'Ctrl+D', click: () => mainWindow.webContents.executeJavaScript('play(sources[getVideoIndex()])')}));
menu.append(new MenuItem({ label: 'Open DevTools', accelerator: 'F12', click: () => mainWindow.openDevTools()}));
Menu.setApplicationMenu(menu);

app.on('window-all-closed', app.quit);

app.on('second-instance', () => {
	if(mainWindow) {
		if(mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	};
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		frame: false,
		resizable: false,
		alwaysOnTop: false
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on('closed', function() { mainWindow = null });
});
