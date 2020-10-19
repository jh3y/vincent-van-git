const url = require('url')
const path = require('path')
const { broadcast, downloadShellScript } = require('./broadcaster')
const { readConfig, writeConfig } = require('./config-utility')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow
let isDev

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true
}

const saveSnapshot = async (name, commits, event) => {
  try {
    const CONFIG = await readConfig()
    // Here, check that if name exists.
    // Check if CONFIG.images contains something with
    // that name or combination of commits.
    // If it does contain the commits, do nothing.
    // If it contains the name, update it after a confirm.

    let newImages = [...CONFIG.images]
    // Filter for the name.
    const EXISTS_BY_NAME =
      CONFIG.images.filter((image) => image.name === name).length > 0
    const EXISTS_BY_VALUE =
      CONFIG.images.filter(
        (image) => JSON.stringify(image.commits) === JSON.stringify(commits)
      ).length > 0
    // console.info(EXISTS_BY_VALUE, EXISTS_BY_NAME, name, commits)
    if (EXISTS_BY_VALUE) {
      throw Error('VVG: Snapshot already saved!')
    } else if (EXISTS_BY_NAME) {
      newImages = newImages.map((image) => ({
        name: image.name,
        commits: image.name === name ? commits : image.commits,
      }))
    } else {
      newImages = [...newImages, { name, commits }]
    }

    const NEW_CONFIG = {
      ...CONFIG,
      images: newImages,
    }
    await writeConfig(NEW_CONFIG)
    event.reply('snapshot-saved', {
      message: `VVG: Snapshot ${EXISTS_BY_NAME ? 'updated' : 'saved'}!`,
      config: NEW_CONFIG,
      saved: JSON.stringify({ name, commits }),
    })
  } catch (err) {
    if (!name || !commits) throw Error('VVG: No name or commits passed')
    else throw Error(err)
  }
}

ipcMain.on('generate-script', async (event, { commits }) => {
  try {
    const { username, repository, branch } = await readConfig()
    await downloadShellScript(commits, username, repository, branch)
    event.reply('script-downloaded', {
      message: 'Script downloaded',
    })
  } catch (err) {
    event.reply('vvg-error', {
      message: err
    })
  }
})

ipcMain.on('save-snapshot', async (event, { name, commits }) => {
  try {
    await saveSnapshot(name, commits, event)
  } catch (err) {
    event.reply('snapshot-save-fail', {
      message: err,
    })
  }
})

ipcMain.on('message-send', async (event, { name, commits }) => {
  try {
    // Silent save with a timestamp???
    // await saveSnapshot(name, commits)
    const CONFIG = await readConfig()
    broadcast(
      {
        ...CONFIG,
        commits,
      },
      event
    )
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('update-config', async (event, message) => {
  await writeConfig(message)
  const CONFIG = await readConfig()
  console.info(CONFIG)
})

ipcMain.handle('grab-config', async () => {
  const CONFIG = await readConfig()
  return CONFIG
})

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 880,
    height: 200,
    show: false,
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
