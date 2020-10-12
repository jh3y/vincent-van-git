import React from 'react'
import { ipcRenderer } from 'electron'

const App = () => {
  const sendMessage = () => {
    ipcRenderer.send('message-send', 'Hello Friend!')
  }

  return (
    <div className="app">
      <button onClick={sendMessage}>Hello from the other side! 👋</button>
    </div>
  )
}

export default App
