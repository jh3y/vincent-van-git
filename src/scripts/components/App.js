import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import { useForm } from 'react-hook-form'
import CommitGrid from './commit-grid'
import SettingsDrawer from './settings-drawer'

const App = () => {
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      name: 'Leave blank to not save',
    },
  })
  const [snapshot, setSnapshot] = useState('')
  const [config, setConfig] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showSave, setShowSave] = useState(false)
  const [cleared, setCleared] = useState(new Date().toUTCString())
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))
  const snapshotNameRef = useRef(null)

  const clearGrid = () => {
    if (confirm('Are you sure you wish to clear the grid?')) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setSnapshot('')
      snapshotNameRef.current.value = ''
      setCleared(new Date().toUTCString())
    }
  }

  const deleteSnapshot = () => {
    console.info('DELETE', snapshot)
  }

  const saveSnapshot = () => {
    if (
      snapshotNameRef.current.value.trim() !== '' &&
      cellsRef.current.filter((cell) => cell !== 0).length
    ) {
      ipcRenderer.send('save-snapshot', {
        commits: cellsRef.current,
        name: snapshotNameRef.current.value,
      })
    }
  }

  const sendGrid = () => {
    const MSG = `
      Push commits to Github?

      Have you saved your image?

      WARNING: Please make sure the repo is empty that you are pushing to!
    `
    if (confirm(MSG)) {
      ipcRenderer.send('message-send', {
        commits: cellsRef.current,
        name: snapshotNameRef.current.value,
      })
    }
  }

  const generateScript = () => {
    ipcRenderer.send('generate-script', {
      commits: cellsRef.current,
    })
  }

  useEffect(() => {
    ipcRenderer.on('vvg-progress', (event, arg) => {
      console.log(arg)
      setUploading(arg.progress !== 100)
      setShowSave(false)
    })
    ipcRenderer.on('vvg-error', (event, arg) => {
      setUploading(false)
      setShowSave(false)
      alert(arg.message)
    })
    ipcRenderer.on('snapshot-save-fail', (event, arg) => {
      alert(arg.message)
    })
    ipcRenderer.on('snapshot-saved', (event, arg) => {
      alert(arg.message)
      setConfig(arg.config)
      setSnapshot(arg.saved)
    })
    ipcRenderer.on('script-downloaded', (event, arg) => {
      alert(arg.message)
    })
  }, [])

  useEffect(() => {
    const grabConfig = async () => {
      const config = await ipcRenderer.invoke('grab-config')
      setConfig(config)
    }
    grabConfig()
  }, [])

  const selectSnapshot = (e) => {
    console.info(e.button)
    setSnapshot(e.target.value)
    if (e.target.value === 'Select a snapshot') return
    const { name, commits } = JSON.parse(e.target.value)
    snapshotNameRef.current.value = name
    cellsRef.current = commits.map((value) => parseInt(value, 10))
    setCleared(new Date().toUTCString())
  }

  console.info(snapshot)

  return (
    <div className="app">
      {!uploading && (
        <Fragment>
          <CommitGrid key={cleared} cells={cellsRef.current} />
          <button onClick={clearGrid}>Clear</button>
          <button onClick={generateScript}>Generate</button>
          <button onClick={sendGrid}>Send</button>
          <button onClick={saveSnapshot}>Save Snapshot</button>
          {snapshot !== '' && <button onClick={deleteSnapshot}>Delete</button>}
          <input type="text" ref={snapshotNameRef} />
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
          <SettingsDrawer {...config} />
        </Fragment>
      )}
      {uploading && <h1>Commits being generated, please wait.</h1>}
    </div>
  )
}

export default App
