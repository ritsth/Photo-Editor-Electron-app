const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img')
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron');

//return true if the platform is macOS
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        titile: 'Photo Editor ',
        width: isDev? 1000: 500,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    //Since electron used chromium under the hood we can you dev tool (inspect)
    //open dev tool if in dev env 
    if (isDev){
        mainWindow.webContents.openDevTools();
    }

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

    //Implement Custom menu
    const mainMenu= Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        mainWindow == null
    });
    
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

//Respond to ipcRenderer resize
ipcMain.on('image:resize',(e,options) => {
    options.dest=path.join(os.homedir(),'Downloads','Resized_img');
    ResizeImg(options);
    console.log(options);
})

//since resizeImg returns a promise we have to awit on it so have to use async await
 async function ResizeImg({imgpath, width, height,dest}){
    try{
        const newPath = await resizeImg(fs.readFileSync(imgpath),{
            width: +width,
            height: +height, //+ converts string to number 
        });

        //Create filename //overrides of already exits
        const filename = path.basename(imgpath);

        //Create destination folder if doesn't exist
        if(!fs.existsSync(dest)){
            fs.mkdirSync(dest);
        }

        //Write to dest
        fs.writeFileSync(path.join(dest,filename),newPath);

        //Send sucess msg by calling the event 'image:Resized'
        mainWindow.webContents.send('image:Resized');

        //open dest folder
        shell.openPath(dest);



    }catch(error){
        console.log(error);
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  })