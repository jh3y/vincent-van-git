const { exec } = require('child_process')

const Receiver = message => {
  exec(`Say ${message}`)
}

module.exports = Receiver