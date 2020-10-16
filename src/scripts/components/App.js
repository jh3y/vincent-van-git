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
  const [config, setConfig] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showSave, setShowSave] = useState(false)
  const [cleared, setCleared] = useState(new Date().toUTCString())
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))

  const clearGrid = () => {
    if (confirm('Are you sure you wish to clear the grid?')) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setCleared(new Date().toUTCString())
    }
  }

  const onSend = (values) => {
    ipcRenderer.send('message-send', {
      commits: cellsRef.current,
      name: values.imagename,
    })
  }

  const sendGrid = () => {
    if (confirm('Push commits to Github?')) {
      setShowSave(true)
    }
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
  }, [])

  useEffect(() => {
    const grabConfig = async () => {
      const config = await ipcRenderer.invoke('grab-config')
      setConfig(config)
    }
    grabConfig()
  }, [])

  const selectSnapshot = e => {
    console.info(e.target.value)
    if (e.target.value.split(',').length > 1) {
      console.info("LOAD THIS", e.target.value.split(',').length)
      cellsRef.current = e.target.value.split(',').map(value => parseInt(value, 10))
      setCleared(new Date().toUTCString())
    }
  }

  console.info(cellsRef.current)

  return (
    <div className="app">
      {!uploading && !showSave && (
        <Fragment>
          <CommitGrid key={cleared} cells={cellsRef.current} />
          <button onClick={clearGrid}>Clear</button>
          <button onClick={sendGrid}>Send</button>
          {config && config.images && config.images.length > 0 && (
            <select onChange={selectSnapshot}>
              <option>Select a snapshot</option>
              {config.images.map(({ name, commits }, index) => (
                <option value={commits} key={index}>{name}</option>
              ))}
            </select>
          )}
          <SettingsDrawer {...config} />
        </Fragment>
      )}
      {uploading && <h1>Commits being generated, please wait.</h1>}
      {showSave && !uploading && (
        <form onSubmit={handleSubmit(onSend)}>
          <label htmlFor="name">Image name</label>
          <input name="imagename" type="text" id="name" ref={register()} />
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  )
}

export default App
