const url = require('url')
const receiver = require('./receiver')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true
}

ipcMain.on('message-send', (event, message) => {
  receiver(message)
})

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  let indexPath

  indexPath = url.format({
    protocol: 'http:',
    host: 'localhost:3000',
    pathname: 'index.html',
    slashes: true,
  })

  mainWindow.loadURL(indexPath)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createMainWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})

// Stop error
app.allowRendererProcessReuse = true
