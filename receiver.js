const { exec } = require('child_process')
const { broadcast } = require('./broadcaster')
const Receiver = (message, event) => {
  // Event enables replies from ipcMain, fingers crossed!
  broadcast(message, event)
}

module.exports = Receiver