import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import gsap from 'gsap'
import CommitGrid from './commit-grid'
import SettingsDrawer from './settings-drawer'
import InfoDrawer from './info-drawer'
import Toasts from './toasts'
import Vincent from './vincent'
import AudioOn from './icons/volume-on.svg'
import AudioOff from './icons/volume-off.svg'
import useSound from '../hooks/useSound'
import CLICK_PATH from '../../../assets/audio/click.mp3'
import SPARKLE_PATH from '../../../assets/audio/sparkle.mp3'
import TRUMPET_PATH from '../../../assets/audio/trumpet-fanfare.mp3'
import BRUSH_PATH from '../../../assets/audio/brush-stroke.mp3'
import { MESSAGING_CONSTANTS, MESSAGES } from '../../../constants'

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
  const { play: sparklePlay } = useSound(SPARKLE_PATH)
  const { play: brushPlay } = useSound(BRUSH_PATH)
  const { play: trumpetPlay } = useSound(TRUMPET_PATH)
  // Cleared is used to set the key on the CommitGrid which forces it
  // to re-render the cell reference.
  const [cleared, setCleared] = useState(new Date().toUTCString())
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))

  const selectImage = (e) => {
    setImage(e.target.value) // Could be set to the Object???
    if (e.target.value === SELECT_PLACEHOLDER) return
    const { name, commits } = JSON.parse(e.target.value)
    setImageName(name)
    cellsRef.current = sanitizeDays(commits, NUMBER_OF_DAYS).map((value) =>
      parseInt(value, 10)
    )
    setCleared(new Date().toUTCString())
    setDirty(true)
    if (!config.muted) sparklePlay()
    ipcRenderer.send(MESSAGING_CONSTANTS.INFO, {
      message: MESSAGES.LOADED,
    })
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
    if (!config.muted) clickPlay()
    if (confirm(MESSAGES.CONFIRM_WIPE)) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setImage('') // Setting to empty string to select default.
      setImageName('')
      setCleared(new Date().toUTCString())
      setDirty(false)
      if (!config.muted) brushPlay()
      ipcRenderer.send(MESSAGING_CONSTANTS.INFO, {
        message: MESSAGES.WIPED,
      })
    }
  }

  const toggleAudio = () => {
    if (config.muted) clickPlay()
    ipcRenderer.send(MESSAGING_CONSTANTS.UPDATE, {
      config: {
        ...config,
        muted: !config.muted,
      },
      silent: true,
    })
  }

  const deleteImage = () => {
    if (!config.muted) clickPlay()
    const name = JSON.parse(image).name
    if (confirm(MESSAGES.CONFIRM_DELETE(name))) {
      setImage('')
      setImageName('')
      ipcRenderer.send(MESSAGING_CONSTANTS.DELETE, {
        name,
      })
    }
  }

  const saveImage = () => {
    if (!config.muted) clickPlay()
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
    if (!config.muted) clickPlay()
    if (confirm(MESSAGES.CONFIRM_PUSH)) {
      setSubmitted(true)
      ipcRenderer.send(MESSAGING_CONSTANTS.PUSH, {
        commits: sanitizeDays(cellsRef.current, NUMBER_OF_DAYS),
        name: imageName,
      })
    }
  }

  const generateScript = () => {
    if (!config.muted) clickPlay()
    setSubmitted(true)
    setMessage('Please wait...')
    ipcRenderer.send(MESSAGING_CONSTANTS.GENERATE, {
      commits: sanitizeDays(cellsRef.current, NUMBER_OF_DAYS),
    })
  }

  useEffect(() => {
    ipcRenderer.on(MESSAGING_CONSTANTS.INFO, (event, arg) => {
      if (arg.hasOwnProperty('uploading')) {
        setUploading(arg.uploading)
      }
      if (arg.hasOwnProperty('numberOfCommits') && arg.numberOfCommits !== 0) {
        setMessage(`${arg.numberOfCommits} commits being generated`)
      }
      if (arg.config) {
        setConfig(arg.config)
      }
    })
    ipcRenderer.on(MESSAGING_CONSTANTS.SUCCESS, (event, arg) => {
      if (arg.config) {
        setConfig(arg.config)
      }
      if (arg.saved) {
        setImage(arg.saved)
      }
      if (arg.hasOwnProperty('uploading')) {
        setUploading(arg.uploading)
      }
    })
    ipcRenderer.on(MESSAGING_CONSTANTS.ERROR, (event, arg) => {
      setError(true)
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
    if ((!uploading && coding) || error) {
      if (!config.muted && !error) trumpetPlay()
      timer = setTimeout(
        () => {
          gsap.to(progressRef.current, {
            '--left': 100,
            duration: TIMING.SLIDE,
            onComplete: () => {
              setCoding(false)
              setUploading(false)
              setSubmitted(false)
              setError(false)
              gsap.set(progressRef.current, {
                '--left': 0,
                '--right': 100,
              })
            },
          })
        },
        error ? TIMING.BUFFER * 500 : TIMING.BUFFER * 1000
      )
    } else if (uploading && !coding) {
      setCoding(true)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [uploading, error, coding])

  return (
    <div className="app">
      <div className="canvas-area">
        <CommitGrid
          muted={(config && config.muted) || false}
          onChange={checkDirty}
          key={cleared}
          cells={cellsRef.current}
        />
        <Actions />
        <SettingsDrawer {...config} />
        <InfoDrawer {...config} />
      </div>
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
        {(coding || uploading || submitted) && (
          <h1 className="progress-screen__message">{message}</h1>
        )}
      </div>
      <input id="audio" type="checkbox" onChange={toggleAudio} />
      <label
        htmlFor="audio"
        title="Toggle audio"
        className="icon-button audio-toggle">
        {config && config.muted ? <AudioOff /> : <AudioOn />}
      </label>
      <Toasts />
    </div>
  )
}

export default App
