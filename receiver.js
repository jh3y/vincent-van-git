const { exec } = require('child_process')
const { broadcast } = require('./broadcaster')
const Receiver = message => {
  broadcast(message)
}

module.exports = Receiver