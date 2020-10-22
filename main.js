const url = require('url')
const path = require('path')
const { APP_CONSTANTS, MESSAGING_CONSTANTS } = require('./src/constants')
const { broadcast, downloadShellScript } = require('./src/node/broadcaster')
const { readConfig, saveConfig, writeConfig } = require('./src/node/config-utility')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow
let isDev

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true
}

ipcMain.on(MESSAGING_CONSTANTS.GENERATE, async (event, { commits }) => {
  event.reply(MESSAGING_CONSTANTS.MESSAGE, {
    uploading: true,
  })
  try {
    const { username, repository, branch } = await readConfig()
    await downloadShellScript(commits, username, repository, branch)
    event.reply(MESSAGING_CONSTANTS.MESSAGE, {
      message: 'Script downloaded',
      uploading: false,
    })
  } catch (err) {
    event.reply(MESSAGING_CONSTANTS.ERROR, {
      message: err
    })
  }
})

ipcMain.on(MESSAGING_CONSTANTS.DELETE, async (event, { name }) => {
  console.info('DELETE', name)
})

ipcMain.on(MESSAGING_CONSTANTS.SAVE, async (event, { name, commits }) => {
  try {
    await saveConfig(name, commits, event)
  } catch (err) {
    event.reply(MESSAGING_CONSTANTS.ERROR, {
      message: err,
    })
  }
})

ipcMain.on(MESSAGING_CONSTANTS.PUSH, async (event, { name, commits }) => {
  event.reply(MESSAGING_CONSTANTS.MESSAGE, {
    uploading: true,
  })
  try {
    // Silent save with a timestamp???
    // await saveSnapshot(name, commits)
    const CONFIG = await readConfig()
    await broadcast(
      {
        ...CONFIG,
        commits,
      },
      event
    )
    event.reply(MESSAGING_CONSTANTS.MESSAGE, {
      message: 'Commits pushed up',
      uploading: false,
    })
  } catch (err) {
    event.reply(MESSAGING_CONSTANTS.ERROR, {
      message: err,
    })
  }
})

ipcMain.on(MESSAGING_CONSTANTS.UPDATE, async (event, message) => {
  // Issue here. Writing to nothing. Can't read empty!
  // If not empty, overrides configurations.
  const CONFIG = await writeConfig(message)
  event.reply(MESSAGING_CONSTANTS.UPDATED, {
    message: 'User settings updated'
  })
  event.reply(MESSAGING_CONSTANTS.MESSAGE, {
    config: CONFIG
  })
})

ipcMain.handle(MESSAGING_CONSTANTS.CONFIG, async () => {
  const CONFIG = await readConfig()
  return CONFIG
})

// Electron Boilerplate stuff
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: APP_CONSTANTS.WIDTH,
    height: APP_CONSTANTS.HEIGHT,
    show: false,
    useContentSize: true,
    resizable: isDev,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  let indexPath

  if (isDev) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:3000',
      pathname: 'index.html',
      slashes: true,
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'app', 'index.html'),
      slashes: true,
    })
  }

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
