const { app } = require('electron')
const { MESSAGING_CONSTANTS } = require('../constants')
const fs = require('fs')
const CONFIG_PATH = `${app.getAppPath()}/vincent-van-git.config.json`

const writeConfig = async (config) => {
  const CURRENT_CONFIG = await readConfig()
  await fs.promises.writeFile(
    CONFIG_PATH,
    JSON.stringify({
      ...CURRENT_CONFIG,
      ...config,
    })
  )
}

const readConfig = async () => {
  try {
    const DATA = await fs.promises.readFile(CONFIG_PATH, 'utf-8')
    return JSON.parse(DATA)
  } catch (err) {
    console.info('VVG: No config so creating one')
    await writeConfig({})
    return {}
  }
}

const saveConfig = async (name, commits, event) => {
  try {
    const CONFIG = await readConfig()
    let newImages = CONFIG.images ? [...CONFIG.images] : []
    const EXISTS_BY_NAME =
      newImages.filter((image) => image.name === name).length > 0
    const EXISTS_BY_VALUE =
      newImages.filter(
        (image) => JSON.stringify(image.commits) === JSON.stringify(commits)
      ).length > 0
    if (EXISTS_BY_VALUE) {
      newImages = newImages.map((image) => ({
        name:
          JSON.stringify(image.commits) === JSON.stringify(commits)
            ? name
            : image.name,
        commits: image.commits,
      }))
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
    event.reply(MESSAGING_CONSTANTS.MESSAGE, {
      message: `VVG: Snapshot ${
        EXISTS_BY_NAME || EXISTS_BY_VALUE ? 'updated' : 'saved'
      }!`,
      config: NEW_CONFIG,
      saved: JSON.stringify({ name, commits }),
    })
  } catch (err) {
    if (!name || !commits) throw Error('VVG: No name or commits passed')
    else throw Error(err)
  }
}

module.exports = {
  writeConfig,
  readConfig,
  saveConfig,
}
