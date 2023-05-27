import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'

import localStorage from 'electron-localstorage'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST
process.env.SERVER_ADDRESS = "http://localhost:5209"

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({           
    width: 700,
    height: 500,
    // 无边框
    frame: false,
    // 不可缩放
    resizable: false,
    
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  //设置永远在最上层
  win.setAlwaysOnTop(true)

  //如果是在开发环境下
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    //加载 http:\localhost:5173\login.html文件，也就是public文件夹下的login.html文件
    const newUrl = join(url, "html/login.html")
    win.loadURL(newUrl)

    // win.loadURL(url)加载 http:\localhost:5173，也就是vite默认的入口文件
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
    console.log(newUrl)
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344


}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

//监听close-login-win消息
ipcMain.on('close-win', function(){
  console.log('i get close-login-win')
  //关闭当前窗口
  win.close()
})

//监听jump-to-word消息
ipcMain.on('jump-to-word', function(){
  console.log('i get jump-to-word')
  win.close()
  craeteWordWindow()
})

//创建word窗口
async function craeteWordWindow(){
  // localStorage.setItem(`myCat`, `Tom`);

  win = new BrowserWindow({           
    width: 300,
    height: 300,
    // 无边框
    frame: false,
    // 不可缩放
    // resizable: false,
    // 窗口透明
    // transparent: true,
    
    // backgroundColor: '#00000000', // 背景色为无色

    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  // win.setIgnoreMouseEvents(true, { forward: true }) // 设置窗口为覆盖区域（不可点击，只可以看，相当于截图）

  //设置永远在最上层
  win.setAlwaysOnTop(true)

  //如果是在开发环境下
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    //加载 http:\localhost:5173\login.html文件，也就是public文件夹下的login.html文件
    const newUrl = join(url, "html/word.html")
    win.loadURL(newUrl)

    // win.loadURL(url)加载 http:\localhost:5173，也就是vite默认的入口文件
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
    console.log(newUrl)
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

}

//监听jump-to-note消息
ipcMain.on('jump-to-note', function(){
  console.log('i get jump-to-note')
  win.close()
  createNoteWindow()
})

//创建note窗口
async function createNoteWindow() {
  let cat = localStorage.getItem(`myCat`);
  let delta = localStorage.getItem('note');
  console.log(cat)
  console.log(delta)
  win = new BrowserWindow({           
    width: 500,
    height: 500,
    // 无边框
    // frame: false,
    // 不可缩放
    // resizable: false,
    // 窗口透明
    // transparent: true,
    
    // backgroundColor: '#00000000', // 背景色为无色

    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  // win.setIgnoreMouseEvents(true, { forward: true }) // 设置窗口为覆盖区域（不可点击，只可以看，相当于截图）

  //设置永远在最上层
  win.setAlwaysOnTop(true)

  //如果是在开发环境下
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    //加载 http:\localhost:5173\login.html文件，也就是public文件夹下的login.html文件
    const newUrl = join(url, "html/note.html")
    win.loadURL(newUrl)

    // win.loadURL(url)加载 http:\localhost:5173，也就是vite默认的入口文件
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
    console.log(newUrl)
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

}

//监听save-note消息
ipcMain.on('save-note', (event, data) => {
  console.log('i get save-note')
  localStorage.removeItem('note')
  localStorage.setItem('note', data)
})

//监听get-note消息
ipcMain.on('get-note', (event, args) => {
  console.log('i get get-note', localStorage.getItem('note'))
  event.sender.send('get-note-response', {'delta' : localStorage.getItem('note')})
  console.log('i send get-note-response')
})

//监听save-token消息
ipcMain.on('save-token', (event, data) => {
  console.log('i get save-token')
  localStorage.removeItem('token')
  localStorage.setItem('token', data)
  console.log(data)
})

//监听get-token消息
ipcMain.on('get-token', (event, args) => {
  event.sender.send('get-token-response', localStorage.getItem('token'))
  console.log('i send get-note-response')
})

//创建message窗口
async function createMessageWindow() {
  win = new BrowserWindow({           
    width: 700,
    height: 500,
    // 无边框
    frame: false,
    // 不可缩放
    // resizable: false,
    
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  //设置永远在最上层
  win.setAlwaysOnTop(true)

  //如果是在开发环境下
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    //加载 http:\localhost:5173\login.html文件，也就是public文件夹下的login.html文件
    const newUrl = join(url, "html/message.html")
    win.loadURL(newUrl)

    // win.loadURL(url)加载 http:\localhost:5173，也就是vite默认的入口文件
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
    console.log(newUrl)
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344


}

//监听jump-to-message消息
ipcMain.on('jump-to-message', function(){
  win.close()
  createMessageWindow()
})

//创建register窗口
async function createRegisterWindow() {
  win = new BrowserWindow({           
    width: 500,
    height: 320,
    // 无边框
    frame: false,
    // 不可缩放
    // resizable: false,
    
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  //设置永远在最上层
  win.setAlwaysOnTop(true)

  //如果是在开发环境下
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    //加载 http:\localhost:5173\login.html文件，也就是public文件夹下的login.html文件
    const newUrl = join(url, "html/register.html")
    win.loadURL(newUrl)

    // win.loadURL(url)加载 http:\localhost:5173，也就是vite默认的入口文件
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
    console.log(newUrl)
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344


}

//监听jump-to-register消息
ipcMain.on('jump-to-register', function(){
  win.close()
  createRegisterWindow()
})

//创建userprofile窗口
async function createUserprofileWindow() {
  win = new BrowserWindow({           
    width: 380,
    height: 400,
    // 无边框
    frame: false,
    // 不可缩放
    // resizable: false,
    
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  //设置永远在最上层
  win.setAlwaysOnTop(true)

  //如果是在开发环境下
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    //加载 http:\localhost:5173\login.html文件，也就是public文件夹下的login.html文件
    const newUrl = join(url, "html/userprofile.html")
    win.loadURL(newUrl)

    // win.loadURL(url)加载 http:\localhost:5173，也就是vite默认的入口文件
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
    console.log(newUrl)
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344


}

//监听jump-to-user消息
ipcMain.on('jump-to-userprofile', function(){
  win.close()
  createUserprofileWindow()
})

//监听jump-to-login消息
ipcMain.on('jump-to-login', function(){
  win.close();
  createWindow()
})
