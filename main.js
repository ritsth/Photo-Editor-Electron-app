const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img')
const {app, BrowserWindow, Menu, ipcMain, shell, nativeImage} = require('electron');

//return true if the platform is macOS
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

 
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Photo Editor',
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

    mainWindow.loadFile(path.join (__dirname,'./renderer/main_window.html'));
}

//Create About window
function createAboutWindow(){
    const aboutWindow = new BrowserWindow({
        title: 'About',
        width: isDev? 1000: 500,
        height: 800
    });

    aboutWindow.loadFile(path.join (__dirname,'./renderer/about.html'));
}

//Create resize window
function createResizeWindow(){
    const resizeWindow = new BrowserWindow({
        title: 'Resize Window',
        width: isDev? 1000: 500,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    resizeWindow.webContents.openDevTools();

    resizeWindow.loadFile(path.join (__dirname,'./renderer/resize.html'));
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
        },

    ]

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

        },]
    }]:[]),
    {
        //In the menu 
        label: 'Edit',
        submenu: [{
            label: 'Resize',
            click: createResizeWindow,
            // accelerator: 'CmdOrCtrl+W' 
        },
        
    ]        
    }
    
]

//Respond to ipcRenderer resize
ipcMain.on('image:save',(e,options) => {
    // console.log(options.dataURL);
    const dest = path.join(os.homedir(),'Downloads',options.filename_input);
    //Write to dest
    const base64Data = options.dataURL.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(dest,base64Data,'base64');

    //open dest folder
    shell.openPath(dest);


})

//Respond to ipcRenderer resize
ipcMain.on('image:resize',(e,options) => {
    options.dest=path.join(os.homedir(),'Downloads','Resized_img');
    ResizeImg(options);

})

//since resizeImg returns a promise we have to awit on it so have to use async await
 async function ResizeImg({imgpath, width, height,dest}){
    try{
        const newPath = await resizeImg(fs.readFileSync(imgpath),{
            width: +width,
            height: +height, //+ converts string to number 
        });
        console.log(newPath);
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