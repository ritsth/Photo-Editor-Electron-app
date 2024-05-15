const path = require('path');
const {app, BrowserWindow, Menu} = require('electron');

//return true if the platform is macOS
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        titile: 'Photo Editor ',
        width: isDev? 1000: 500,
        height: 800
    });

    //Since electron used chromium under the hood we can you dev tool (inspect)
    //open dev tool if in dev env 
    if (isDev){
        mainWindow.webContents.openDevTools();
    }

    //Implement Custom menu
    const mainMenu= Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.loadFile(path.join (__dirname,'./renderer/index.html'));
}

//Create About window
function createAboutWindow(){
    const aboutWindow = new BrowserWindow({
        titile: 'About',
        width: isDev? 1000: 500,
        height: 800
    });

    aboutWindow.loadFile(path.join (__dirname,'./renderer/about.html'));
}

//main thing that runs the app
//returns a promise
//another way : app.on('ready'...)
app.whenReady().then(() => {
    createMainWindow();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow();
        }
    });
})

//Menu template (customizing menu)
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [{
            label: 'About',
            click: createAboutWindow,
            // accelerator: 'CmdOrCtrl+W'
        }]

    }]:[]),
    {   
        // //In the menu 
        // label: 'File',
        // submenu: [{
        //     label: 'Quit',
        //     click: () => app.quit(),
        //     accelerator: 'CmdOrCtrl+W'
        // }]
        role: 'fileMenu',
    },
    ...(!isMac? [{
        label: 'Help',
        submenu: [{
            label: 'About',
            click: createAboutWindow,

        }]
    }]:[])
]


app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  })