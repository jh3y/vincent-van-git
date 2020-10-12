import React from 'react'
import { ipcRenderer } from 'electron'

const App = () => {
  const sendMessage = () => {
    ipcRenderer.send('message-send', 'Hey!')
  }

  return (
    <div className="app">
      <button onClick={sendMessage}>Say "Hey" from the other side! 👋</button>
    </div>
  )
}

export default App
