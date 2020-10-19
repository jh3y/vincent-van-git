const { app } = require('electron')
const fs = require('fs')
const CONFIG_PATH = `${app.getAppPath()}/vincent-van-git.config.json`

const writeConfig = async config => {
  await fs.promises.writeFile(CONFIG_PATH, JSON.stringify(config))
}

const readConfig = async () => {
  const DATA = await fs.promises.readFile(CONFIG_PATH, 'utf-8')
  return JSON.parse(DATA)
}

module.exports = {
  writeConfig,
  readConfig,
}