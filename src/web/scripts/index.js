import React, { useEffect, useState, useRef, useReducer, Fragment } from 'react'
import { render } from 'react-dom'
import CommitGrid from '../../shared/components/commit-grid'
import InfoDrawer from '../../shared/components/info-drawer'
import SettingsDrawer from '../../shared/components/settings-drawer'
import Actions from '../../shared/components/actions'
import Progress from '../../shared/components/progress'
import Toasts from '../../shared/components/toasts'
import AudioToggle from '../../shared/components/audio-toggle'
import useSound from '../../shared/hooks/useSound'
import { MESSAGES, ACTIONS, MESSAGING_CONSTANTS } from '../../shared/constants'
import CLICK_PATH from '../../shared/assets/audio/click.mp3'
import SPARKLE_PATH from '../../shared/assets/audio/sparkle.mp3'
import TRUMPET_PATH from '../../shared/assets/audio/trumpet-fanfare.mp3'
import BRUSH_PATH from '../../shared/assets/audio/brush-stroke.mp3'

import 'regenerator-runtime/runtime'
import '../styles/index.styl'
import '../../shared/styles/shared.styl'

const ROOT_NODE = document.querySelector('#app')

// Generate initial state based off of localStorage
const INITIAL_STATE = {
  muted: false,
  images: [],
  username: 'jh3y',
  repository: 'pic',
  branch: 'main',
  toast: null,
  generating: false,
}
// TODO: Hook this up to localStorage
const APP_REDUCER = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.AUDIO:
      return {
        ...state,
        muted: !state.muted,
        toast: {
          type: MESSAGING_CONSTANTS.INFO,
          message: `Audio ${!state.muted ? 'off' : 'on'}`,
        },
      }
    case ACTIONS.GENERATE:
      return {
        ...state,
        generating: !state.generating,
        toast: {
          type: MESSAGING_CONSTANTS.INFO,
          message: MESSAGES.GENERATING,
        },
      }
    case ACTIONS.SETTINGS:
      return {
        ...state,
        toast: {
          type: MESSAGING_CONSTANTS.INFO,
          message: MESSAGES.SETTINGS,
        },
        username: action.username,
        repository: action.repository,
        branch: action.branch,
      }
    default:
      return state
  }
}

const URL = '/.netlify/functions/vincent'
const App = () => {
  const [
    { username, repository, branch, muted, toast, images, generating },
    dispatch,
  ] = useReducer(APP_REDUCER, INITIAL_STATE)
  const [hideVincent, setHideVincent] = useState(false)
  const [cleared, setCleared] = useState(null)
  const [image, setImage] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [imageName, setImageName] = useState(null)
  const { play: clickPlay } = useSound(CLICK_PATH)
  const { play: sparklePlay } = useSound(SPARKLE_PATH)
  const { play: brushPlay } = useSound(BRUSH_PATH)
  const { play: trumpetPlay } = useSound(TRUMPET_PATH)

  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))

  const onGenerate = async () => {
    if (!muted) clickPlay()
    dispatch({
      type: ACTIONS.GENERATE,
    })
  }

  useEffect(() => {
    const getMultiplier = async () => {
      const resp = await (await fetch(URL)).json()
      // Check for errors, make the right dispatch...
      // Validating configuration
      // Then error potentially
      // Then generating script
      // Then generating script success
      setTimeout(() => {
        console.info(resp)
        setHideVincent(true)
      }, 5000)
    }
    if (generating) {
      getMultiplier()
    }
  }, [generating])

  const onSettingsUpdate = (settings) => {
    dispatch({
      type: ACTIONS.SETTINGS,
      ...settings,
    })
  }

  const onProgressEnd = () => {
    setHideVincent(false)
    dispatch({
      type: ACTIONS.GENERATE,
    })
  }

  const toggleAudio = () => {
    if (muted) clickPlay()
    dispatch({
      type: ACTIONS.AUDIO,
    })
  }
  const checkDirty = () => {
    setDirty(cellsRef.current.filter((cell) => cell !== 0).length > 0)
  }

  const onWipe = () => {
    if (!muted) clickPlay()
    if (window.confirm(MESSAGES.CONFIRM_WIPE)) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setImage('') // Setting to empty string to select default.
      setImageName('')
      setCleared(new Date().toUTCString())
      setDirty(false)
      if (!muted) brushPlay()
    }
  }

  const disabled = dirty || !username || !repository || !branch || generating

  return (
    <Fragment>
      <SettingsDrawer
        username={username}
        repository={repository}
        branch={branch}
        onSubmit={onSettingsUpdate}
      />
      <InfoDrawer />
      <div className="canvas">
        <CommitGrid
          key={cleared}
          muted={muted}
          cells={cellsRef.current}
          onChange={checkDirty}
        />
        <Actions
          dirty={dirty}
          disabled={!disabled}
          onGenerate={onGenerate}
          onWipe={onWipe}
        />
      </div>
      {generating && <Progress hide={hideVincent} onComplete={onProgressEnd} />}
      <AudioToggle onToggle={toggleAudio} />
      <Toasts toast={toast} />
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
