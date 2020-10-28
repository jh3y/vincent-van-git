import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import gsap from 'gsap'
import CommitGrid from './commit-grid'
import SettingsDrawer from './settings-drawer'
import Vincent from './vincent'
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

const TIMING = {
  SLIDE: 1,
  BUFFER: 2,
}

const App = () => {
  const [dirty, setDirty] = useState(false)
  const [image, setImage] = useState('')
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('Please wait...')
  const [config, setConfig] = useState(null)
  const [imageName, setImageName] = useState('')
  const progressRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [coding, setCoding] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { play: clickPlay } = useSound(CLICK_PATH)
  // Cleared is used to set the key on the CommitGrid which forces it
  // to re-render the cell reference.
  const [cleared, setCleared] = useState(new Date().toUTCString())
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))

  const selectImage = (e) => {
    clickPlay()
    setImage(e.target.value) // Could be set to the Object???
    if (e.target.value === SELECT_PLACEHOLDER) return
    const { name, commits } = JSON.parse(e.target.value)
    setImageName(name)
    cellsRef.current = sanitizeDays(commits, NUMBER_OF_DAYS).map((value) =>
      parseInt(value, 10)
    )
    setCleared(new Date().toUTCString())
    setDirty(true)
  }

  const sanitizeDays = (commitArray, cellAmount) => {
    let commits = [...commitArray]
    if (commits.length < cellAmount) {
      commits = [
        ...commits,
        ...new Array(cellAmount - commits.length).fill().map((c) => 0),
      ]
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
      setCleared(new Date().toUTCString())
      setDirty(false)
    }
  }

  const deleteImage = () => {
    clickPlay()
    if (confirm(`Delete ${JSON.parse(image).name}?`)) {
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
      // setCoding(true)
      setSubmitted(true)
      ipcRenderer.send(MESSAGING_CONSTANTS.PUSH, {
        commits: sanitizeDays(cellsRef.current, NUMBER_OF_DAYS),
        name: imageName,
      })
    }
  }

  const generateScript = () => {
    clickPlay()
    setSubmitted(true)
    // setCoding(true)
    setMessage('Please wait...')
    ipcRenderer.send(MESSAGING_CONSTANTS.GENERATE, {
      commits: sanitizeDays(cellsRef.current, NUMBER_OF_DAYS),
    })
  }

  useEffect(() => {
    ipcRenderer.on(MESSAGING_CONSTANTS.MESSAGE, (event, arg) => {
      // if (arg.pushing) {
      //   // Grab the number of commits here????
      //   // Here set a ref number for the commits??
      //   // Receive in a message from BE
      //   // setUploading(true)
      // }
      if (arg.hasOwnProperty('uploading')) {
        setUploading(arg.uploading)
      }
      if (arg.message) {
        // alert(arg.message)
        console.info(arg.message)
      }
      if (arg.hasOwnProperty('progressMessage')) {
        setMessage(arg.progressMessage)
      }
      if (arg.hasOwnProperty('numberOfCommits') && arg.numberOfCommits !== 0) {
        setMessage(
          `${arg.numberOfCommits} commits being generated. Please wait...`
        )
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
      setError(arg.message)
      console.info('TOAST IT', arg.message)
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
    if (coding && progressRef.current) {
      gsap.set(progressRef.current, { '--right': 100 })
      gsap.to(progressRef.current, {
        '--right': 0,
        duration: TIMING.SLIDE,
      })
    }
  }, [coding])

  useEffect(() => {
    let timer
    if ((!uploading && coding) || (error && coding)) {
      timer = setTimeout(() => {
        gsap.to(progressRef.current, {
          '--left': 100,
          duration: TIMING.SLIDE,
          onComplete: () => {
            setCoding(false)
            setUploading(false)
            setSubmitted(false)
            gsap.set(progressRef.current, {
              '--left': 0,
              '--right': 100,
            })
          },
        })
      }, TIMING.BUFFER * 1000)
    } else if (error) {
      setSubmitted(false)
      setCoding(false)
      setUploading(false)
    } else if (uploading && !coding) {
      setCoding(true)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [uploading, error, coding])

  return (
    <div className="app">
      {true && (
        <div className="canvas-area">
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
                !config.branch ||
                coding ||
                uploading ||
                submitted
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
                !config.branch ||
                coding ||
                uploading ||
                submitted
              }
              className="icon-button"
              onClick={generateScript}
              title="Download Shell Script">
              <Download />
            </button>
            <button
              disabled={!dirty || coding || uploading || submitted}
              className="icon-button"
              onClick={clearGrid}
              title="Wipe Grid">
              <Erase />
            </button>
            {config && config.images && config.images.length > 0 && (
              <div className="select-wrapper">
                <select
                  onClick={clickPlay}
                  disabled={coding || uploading || submitted}
                  onChange={selectImage}
                  value={image}>
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
                disabled={coding || uploading || submitted}
                placeholder={INPUT_PLACEHOLDER}
                onChange={(e) => setImageName(e.target.value)}
                value={imageName}
              />
              <button
                disabled={
                  imageName.trim() === '' || coding || uploading || submitted
                }
                className="icon-button"
                onClick={saveImage}
                title="Save image configuration">
                <Save />
              </button>
              {image !== '' && (
                <button
                  disabled={coding || uploading || submitted}
                  className="icon-button"
                  onClick={deleteImage}
                  title="Delete Image Configuration">
                  <Delete />
                </button>
              )}
            </div>
          </div>
          <SettingsDrawer {...config} />
        </div>
      )}
      <div
        ref={progressRef}
        className="progress-screen"
        style={{
          '--right': 100,
        }}>
        {(coding || uploading || submitted) && (
          <Fragment>
            <Vincent />
          </Fragment>
        )}
        {(coding || uploading || submitted) && <h1>{message}</h1>}
      </div>
    </div>
  )
}

/**
 * Volume Rocker code
 * <input id="volume" type="checkbox"/>
<label for="volume" title="Toggle sound">
  <svg viewBox="0 0 24 24">
    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"></path>
  </svg>
  <svg viewBox="0 0 24 24">
    <path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"></path>
  </svg>
</label>
 */

export default App
