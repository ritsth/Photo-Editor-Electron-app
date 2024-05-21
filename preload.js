const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { contextBridge, ipcRenderer} = require('electron');
const Toastify = require('toastify-js');
const { channel } = require('diagnostics_channel');
const pythonProcess = spawn('python', ['script.py']);

//exposing to renderer js files

contextBridge.exposeInMainWorld('os', {
  // we can also expose variables, not just functions
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
  //spread operator : used when all elements from an object or array need to be included in a new array or object, 
  //or should be applied one-by-one in a function call's arguments list.
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel,data) => ipcRenderer.send(channel,data),
    on: (channel,func) => ipcRenderer.on(channel,(event, ...args)=> func(...args)),
});

// contextBridge.exposeInMainWorld('pythonProcess', {
//   send: (channel,data) => ipcRenderer.send(channel,data),
//   on: (channel,func) => ipcRenderer.on(channel,(event, ...args)=> func(...args)),
// });
