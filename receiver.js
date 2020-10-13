const { exec } = require('child_process')

const Receiver = message => {
  console.info(message)
  exec(`say message received`)
}

module.exports = Receiver