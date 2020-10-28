const url = require('url')
const path = require('path')
const pkg = require('./package.json')
const {
  APP_CONSTANTS,
  MESSAGING_CONSTANTS,
  MESSAGES,
} = require('./src/constants')
const {
  broadcast,
  downloadShellScript,
  validateConfig,
} = require('./src/node/broadcaster')
const {
  readConfig,
  saveConfig,
  writeConfig,
} = require('./src/node/config-utility')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow
let isDev

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true
}

ipcMain.on(MESSAGING_CONSTANTS.INFO, async (event, { message }) => {
  event.reply(MESSAGING_CONSTANTS.INFO, { message })
})

ipcMain.on(MESSAGING_CONSTANTS.GENERATE, async (event, { commits }) => {
  try {
    const { username, repository, branch } = await readConfig()
    event.reply(MESSAGING_CONSTANTS.INFO, {
      uploading: true,
      message: MESSAGES.CHECKING
    })
    await validateConfig(username, repository, branch)
    await downloadShellScript(commits, username, repository, branch, event)
    event.reply(MESSAGING_CONSTANTS.SUCCESS, {
      message: MESSAGES.DOWNLOADED,
      uploading: false,
    })
  } catch (err) {
    event.reply(MESSAGING_CONSTANTS.ERROR, {
      message: err,
    })
  }
})

ipcMain.on(MESSAGING_CONSTANTS.DELETE, async (event, { name }) => {
  const CONFIG = await readConfig()
  const NEW_CONFIG = {
    ...CONFIG,
    images: CONFIG.images.filter((image) => image.name !== name),
  }
  await writeConfig(NEW_CONFIG)
  event.reply(MESSAGING_CONSTANTS.INFO, {
    message: MESSAGES.DELETED,
    config: NEW_CONFIG,
  })
})

ipcMain.on(MESSAGING_CONSTANTS.SAVE, async (event, { name, commits }) => {
  try {
    const { saved, message, config } = await saveConfig(name, commits, event)
    event.reply(MESSAGING_CONSTANTS.SUCCESS, {
      message,
      config,
      saved,
    })
  } catch (err) {
    event.reply(MESSAGING_CONSTANTS.ERROR, {
      message: err,
    })
  }
})

ipcMain.on(MESSAGING_CONSTANTS.PUSH, async (event, { name, commits }) => {
  try {
    // Silent save with a timestamp???
    // await saveSnapshot(name, commits)
    event.reply(MESSAGING_CONSTANTS.INFO, {
      uploading: true,
      message: MESSAGES.CHECKING,
    })
    const CONFIG = await readConfig()
    await validateConfig(CONFIG.username, CONFIG.repository, CONFIG.branch)
    await broadcast(
      {
        ...CONFIG,
        commits,
      },
      event
    )
    event.reply(MESSAGING_CONSTANTS.SUCCESS, {
      message: MESSAGES.PUSHED,
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
  const CONFIG = await writeConfig(message.config)
  event.reply(MESSAGING_CONSTANTS.UPDATED, {
    silent: message.silent,
  })
  event.reply(MESSAGING_CONSTANTS.SUCCESS, {
    config: CONFIG,
    message: MESSAGES.SETTINGS,
    silent: message.silent,
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
    title: `${pkg.name} 🎨 - v${pkg.version}`,
    icon: `${__dirname}/src/assets/images/icon.png`,
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
