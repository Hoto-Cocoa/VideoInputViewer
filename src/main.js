const { app, BrowserWindow, Menu, MenuItem, screen } = require('electron');
let mainWindow;
let menu = new Menu();

const sizes = {
	360: [ 640, 360 ],
	720: [ 1280, 720 ],
	900: [ 1600, 900 ],
	1080: [ 1920, 1080 ],
}

if(!app.requestSingleInstanceLock()) app.quit();
app.allowRendererProcessReuse = false;
menu.append(new MenuItem({ label: 'Change Source', accelerator: 'Ctrl+D', click: () => mainWindow.webContents.executeJavaScript('play(sources[getVideoIndex()])')}));
menu.append(new MenuItem({ label: 'Open DevTools', accelerator: 'F12', click: () => mainWindow.openDevTools()}));
menu.append(new MenuItem({ label: 'Size Up', accelerator: 'Ctrl+=', click: () => size('+')}));
menu.append(new MenuItem({ label: 'Size Down', accelerator: 'Ctrl+-', click: () => size('-')}));
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

function size(type) {
	const sizesKey = Object.keys(sizes);
	const height = mainWindow.getSize()[1];
	const { size: screenSize } = screen.getPrimaryDisplay();
	let sizeIndex = sizesKey.indexOf(height.toString());
	mainWindow.setResizable(true);
	if(type === '+') {
		if(mainWindow.isFullScreen()) return mainWindow.setResizable(false);
		if(screenSize.height === sizes[sizesKey[sizeIndex]].height && screenSize.width === sizes[sizesKey[sizeIndex]].width) return mainWindow.setResizable(false);
		if(sizes[sizesKey[++sizeIndex]]) {
			const nextSize = sizes[sizesKey[sizeIndex]];
			mainWindow.setSize(...nextSize);
			if(screenSize.height === nextSize[1] && screenSize.width === nextSize[0]) mainWindow.setFullScreen(true);
			return mainWindow.setResizable(false);
		}
	}
	if(type === '-') {
		mainWindow.setFullScreen(false);
		if(sizeIndex === 0) return mainWindow.setResizable(false);
		if(sizes[sizesKey[--sizeIndex]]) mainWindow.setSize(...sizes[sizesKey[sizeIndex]]);
		return mainWindow.setResizable(false);
	}
}
