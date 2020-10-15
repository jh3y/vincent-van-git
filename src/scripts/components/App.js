import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import CommitGrid from './commit-grid'

const App = () => {
  const [uploading, setUploading] = useState(false)
  const [cleared, setCleared] = useState(new Date().toUTCString())
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))

  const clearGrid = () => {
    if (confirm('Are you sure you wish to clear the grid?')) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setCleared(new Date().toUTCString())
    }
  }

  const sendGrid = () => {
    if (confirm('Push commits to Github?')) {
      ipcRenderer.send('message-send', cellsRef.current)
    }
  }

  useEffect(() => {
    ipcRenderer.on('vvg-progress', (event, arg) => {
      console.log(arg)
      setUploading(arg.progress !== 100)
    })
  }, [])

  return (
    <div className="app">
      {!uploading && (
        <Fragment>
          <CommitGrid key={cleared} cells={cellsRef.current} />
          <form onSubmit={(e) => e.preventDefault()}>
            <button onClick={clearGrid}>Clear</button>
            <button onClick={sendGrid}>Send</button>
          </form>
        </Fragment>
      )}
      {uploading && <h1>Commits being generated, please wait.</h1>}
    </div>
  )
}

export default App
