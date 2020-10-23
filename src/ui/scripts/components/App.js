import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import gsap from 'gsap'
import CommitGrid from './commit-grid'
import SettingsDrawer from './settings-drawer'
import Save from './icons/content-save.svg'
import Delete from './icons/delete.svg'
import Download from './icons/download.svg'
import Erase from './icons/eraser-variant.svg'
import Rocket from './icons/rocket.svg'
import useSound from '../hooks/useSound'
import CLICK_PATH from '../../../assets/audio/click.mp3'
import { MESSAGING_CONSTANTS } from '../../../constants'

const SELECT_PLACEHOLDER = 'Select Configuration'
const INPUT_PLACEHOLDER = 'Configuration Name'

const App = () => {
  const [dirty, setDirty] = useState(false)
  const [image, setImage] = useState('')
  const [config, setConfig] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [imageName, setImageName] = useState('')
  const { play: clickPlay } = useSound(CLICK_PATH)
  // Cleared is used to set the key on the CommitGrid which forces it
  // to re-render the cell reference.
  const [cleared, setCleared] = useState(new Date().toUTCString())
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))
  const spinnerRef = useRef(null)

  const selectImage = (e) => {
    clickPlay()
    setImage(e.target.value) // Could be set to the Object???
    if (e.target.value === SELECT_PLACEHOLDER) return
    const { name, commits } = JSON.parse(e.target.value)
    setImageName(name)
    cellsRef.current = commits.map((value) => parseInt(value, 10))
    setCleared(new Date().toUTCString())
    setDirty(true)
  }

  const sanitizeDays = (commitArray, cellAmount) => {
    let commits = [...commitArray]
    if (commits.length < cellAmount) {
      commits = [...commits, ...new Array(cellAmount - commits.length).fill().map(c => 0)]
    }
    if (commits.length > cellAmount) {
      commits = commits.slice(0, cellAmount)
    }
    return commits
  }

  const checkDirty = () => {
    setDirty(cellsRef.current.filter((cell) => cell !== 0).length > 0)
  }

  const clearGrid = () => {
    clickPlay()
    if (confirm('Clear grid?')) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setImage('') // Setting to empty string to select default.
      setImageName('')
      // imageNameRef.current.value = ''
      setCleared(new Date().toUTCString())
      setDirty(false)
    }
  }

  const deleteImage = () => {
    clickPlay()
    if (
      confirm(`Delete ${JSON.parse(image).name}?`)
    ) {
      setImage('')
      // imageNameRef.current.value = ''
      setImageName('')
      ipcRenderer.send(MESSAGING_CONSTANTS.DELETE, {
        name: JSON.parse(image).name,
      })
    }
  }

  const saveImage = () => {
    clickPlay()
    if (
      imageName.trim() !== '' &&
      cellsRef.current.filter((cell) => cell !== 0).length
    ) {
      ipcRenderer.send(MESSAGING_CONSTANTS.SAVE, {
        commits: cellsRef.current,
        name: imageName,
      })
    }
  }

  const sendGrid = () => {
    clickPlay()
    const MSG = `
      Push to Github?
    `
    if (confirm(MSG)) {
      ipcRenderer.send(MESSAGING_CONSTANTS.PUSH, {
        commits: sanitizeDays(cellsRef.current, NUMBER_OF_DAYS),
        name: imageName,
      })
    }
  }

  const generateScript = () => {
    clickPlay()
    ipcRenderer.send(MESSAGING_CONSTANTS.GENERATE, {
      commits: sanitizeDays(cellsRef.current, NUMBER_OF_DAYS),
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
      if (arg.hasOwnProperty('uploading')) {
        setUploading(arg.uploading)
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
        setImage(arg.saved)
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

  useEffect(() => {
    let TIMELINE
    if (uploading && spinnerRef.current) {
      TIMELINE = gsap.timeline().to(spinnerRef.current, {
        rotate: 360,
        repeat: -1
      })
    } else if (TIMELINE) {
      TIMELINE.pause()
    }
  }, [uploading])

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
              disabled={
                !dirty ||
                !config.username ||
                !config.repository ||
                !config.branch
              }
              className="icon-button"
              onClick={sendGrid}
              title="Push Image">
              <Rocket />
            </button>
            <button
              disabled={
                !dirty ||
                !config.username ||
                !config.repository ||
                !config.branch
              }
              className="icon-button"
              onClick={generateScript}
              title="Download Shell Script">
              <Download />
            </button>
            <button
              disabled={!dirty}
              className="icon-button"
              onClick={clearGrid}
              title="Wipe Grid">
              <Erase />
            </button>
            {config && config.images && config.images.length > 0 && (
              <div className="select-wrapper">
                <select onClick={clickPlay} onChange={selectImage} value={image}>
                  <option>{SELECT_PLACEHOLDER}</option>
                  {config.images.map(({ name, commits }, index) => (
                    <option
                      value={JSON.stringify({
                        name,
                        commits,
                      })}
                      key={index}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div
              className="configuration-container"
              style={{
                '--scale': dirty ? 1 : 0,
                visibility: dirty ? 'visible' : 'hidden',
              }}>
              <input
                type="text"
                placeholder={INPUT_PLACEHOLDER}
                onChange={e => setImageName(e.target.value)}
                value={imageName}
              />
              <button
                disabled={imageName.trim() === ''}
                className="icon-button"
                onClick={saveImage}
                title="Save image configuration">
                <Save />
              </button>
              {image !== '' && (
                <button
                  className="icon-button"
                  onClick={deleteImage}
                  title="Delete Image Configuration">
                  <Delete />
                </button>
              )}
            </div>
          </div>
          <SettingsDrawer {...config} />
        </Fragment>
      )}
      {uploading && (
        <Fragment>
          <h1>Commits being generated, please wait.</h1>
          <div ref={spinnerRef} className="spinner"></div>
        </Fragment>
      )}
    </div>
  )
}

export default App
