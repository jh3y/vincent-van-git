import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import CommitGrid from './commit-grid'
import SettingsDrawer from './settings-drawer'
import Save from './icons/content-save.svg'
import Delete from './icons/delete.svg'
import Download from './icons/download.svg'
import Erase from './icons/eraser-variant.svg'
import Rocket from './icons/rocket.svg'
import { MESSAGING_CONSTANTS } from '../../../constants'

const App = () => {
  const [dirty, setDirty] = useState(false)
  const [snapshot, setSnapshot] = useState('')
  const [config, setConfig] = useState(null)
  const [uploading, setUploading] = useState(false)
  // Cleared is used to set the key on the CommitGrid which forces it
  // to re-render the cell reference.
  const [cleared, setCleared] = useState(new Date().toUTCString())
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))
  const snapshotNameRef = useRef(null)

  const selectSnapshot = (e) => {
    setSnapshot(e.target.value) // Could be set to the Object???
    if (e.target.value === 'Select a snapshot') return
    const { name, commits } = JSON.parse(e.target.value)
    snapshotNameRef.current.value = name
    cellsRef.current = commits.map((value) => parseInt(value, 10))
    setCleared(new Date().toUTCString())
    setDirty(true)
  }

  const checkDirty = () => {
    setDirty(cellsRef.current.filter((cell) => cell !== 0).length > 0)
  }

  const clearGrid = () => {
    if (confirm('Are you sure you wish to clear the grid?')) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setSnapshot('') // Setting to empty string to select default.
      snapshotNameRef.current.value = ''
      setCleared(new Date().toUTCString())
      setDirty(false)
    }
  }

  const deleteSnapshot = () => {
    if (
      confirm(`Are you sure you want to delete ${JSON.parse(snapshot).name}?`)
    ) {
      ipcRenderer.send(MESSAGING_CONSTANTS.DELETE, {
        name: JSON.parse(snapshot).name,
      })
    }
  }

  const saveSnapshot = () => {
    if (
      snapshotNameRef.current.value.trim() !== '' &&
      cellsRef.current.filter((cell) => cell !== 0).length
    ) {
      ipcRenderer.send(MESSAGING_CONSTANTS.SAVE, {
        commits: cellsRef.current,
        name: snapshotNameRef.current.value,
      })
    }
  }

  const sendGrid = () => {
    const MSG = `
      Push commits to Github?
    `
    if (confirm(MSG)) {
      ipcRenderer.send(MESSAGING_CONSTANTS.PUSH, {
        commits: cellsRef.current,
        name: snapshotNameRef.current.value,
      })
    }
  }

  const generateScript = () => {
    ipcRenderer.send(MESSAGING_CONSTANTS.GENERATE, {
      commits: cellsRef.current,
    })
  }

  useEffect(() => {
    ipcRenderer.on(MESSAGING_CONSTANTS.MESSAGE, (event, arg) => {
      if (arg.pushing) {
        // Grab the number of commits here????
        // Here set a ref number for the commits??
        // Receive in a message from BE
        setUploading(true)
      }
      if (arg.message) {
        alert(arg.message)
      }
      if (arg.config) {
        // Set config to what comes from BE
        setConfig(arg.config)
      }
      if (arg.saved) {
        // This keeps the select in sync
        setSnapshot(arg.saved)
      }
    })
    ipcRenderer.on(MESSAGING_CONSTANTS.ERROR, (event, arg) => {
      setUploading(false)
      alert(arg.message)
    })
  }, [])

  useEffect(() => {
    const grabConfig = async () => {
      const config = await ipcRenderer.invoke(MESSAGING_CONSTANTS.CONFIG)
      setConfig(config)
    }
    grabConfig()
  }, [])

  return (
    <div className="app">
      {!uploading && (
        <Fragment>
          <CommitGrid
            onChange={checkDirty}
            key={cleared}
            cells={cellsRef.current}
          />
          <div className="actions-container">
            <button
              disabled={!dirty}
              className="icon-button"
              onClick={sendGrid}
              title="Push image">
              <Rocket />
            </button>
            <button
              disabled={!dirty}
              className="icon-button"
              onClick={generateScript}
              title="Download shell script">
              <Download />
            </button>
            <button
              disabled={!dirty}
              className="icon-button"
              onClick={clearGrid}
              title="Wipe grid">
              <Erase />
            </button>
            {config && config.images && config.images.length > 0 && (
              <select onChange={selectSnapshot} value={snapshot}>
                <option>Select a snapshot</option>
                {config.images.map(({ name, commits }, index) => (
                  <option
                    onContextMenu={console.info}
                    value={JSON.stringify({
                      name,
                      commits,
                    })}
                    key={index}>
                    {name}
                  </option>
                ))}
              </select>
            )}
            <div
              className="configuration-container"
              style={{
                '--scale': dirty ? 1 : 0,
                visibility: dirty ? 'visible' : 'hidden',
              }}>
              <input
                type="text"
                placeholder="Configuration name"
                ref={snapshotNameRef}
              />
              <button
                className="icon-button"
                onClick={saveSnapshot}
                title="Save image configuration">
                <Save />
              </button>
              {snapshot !== '' && (
                <button
                  className="icon-button"
                  onClick={deleteSnapshot}
                  title="Delete image configuration">
                  <Delete />
                </button>
              )}
            </div>
          </div>
          <SettingsDrawer {...config} />
        </Fragment>
      )}
      {uploading && <h1>Commits being generated, please wait.</h1>}
    </div>
  )
}

export default App
