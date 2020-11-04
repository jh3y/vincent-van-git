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
import {
  MESSAGES,
  ACTIONS,
  MESSAGING_CONSTANTS,
  SELECT_PLACEHOLDER,
  INPUT_PLACEHOLDER,
} from '../../shared/constants'
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
  selected: '',
}

// const saveConfig = (name, commits) => {
//   try {
//     let newImages = CONFIG.images ? [...CONFIG.images] : []
//     const EXISTS_BY_NAME =
//       newImages.filter((image) => image.name === name).length > 0
//     const EXISTS_BY_VALUE =
//       newImages.filter(
//         (image) => JSON.stringify(image.commits) === JSON.stringify(commits)
//       ).length > 0
//     if (EXISTS_BY_VALUE && EXISTS_BY_NAME) {
//       return {
//         message: MESSAGES.NO_CHANGE,
//         config: CONFIG,
//         saved: JSON.stringify({ name, commits }),
//       }
//     } else if (EXISTS_BY_VALUE) {
//       newImages = newImages.map((image) => ({
//         name:
//           JSON.stringify(image.commits) === JSON.stringify(commits)
//             ? name
//             : image.name,
//         commits: image.commits,
//       }))
//     } else if (EXISTS_BY_NAME) {
//       newImages = newImages.map((image) => ({
//         name: image.name,
//         commits: image.name === name ? commits : image.commits,
//       }))
//     } else {
//       newImages = [...newImages, { name, commits }]
//     }

//     const NEW_CONFIG = {
//       ...CONFIG,
//       images: newImages,
//     }
//     await writeConfig(NEW_CONFIG)
//     return {
//       message:
//         EXISTS_BY_NAME || EXISTS_BY_VALUE ? MESSAGES.UPDATED : MESSAGES.SAVED,
//       config: NEW_CONFIG,
//       saved: JSON.stringify({ name, commits }),
//     }
//   } catch (err) {
//     if (!name || !commits) throw Error('VVG: No name or commits passed')
//     else throw Error(err)
//   }
// }

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
    case ACTIONS.SAVE: {
      // Need to check if it exists by name or value.
      const EXISTS_BY_NAME =
        state.images.filter((image) => image.name === action.name).length > 0
      const EXISTS_BY_VALUE =
        state.images.filter(
          (image) => image.commits === JSON.stringify(action.commits)
        ).length > 0
      // If it does, update or do nothing.
      if (EXISTS_BY_VALUE && EXISTS_BY_NAME) {
        return {
          ...state,
          toast: {
            type: MESSAGING_CONSTANTS.INFO,
            message: MESSAGES.NO_CHANGE,
          },
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
        }
      } else if (EXISTS_BY_VALUE) {
        // Changing the name
        return {
          ...state,
          images: state.images.map((image) => ({
            name:
              image.commits === JSON.stringify(action.commits)
                ? action.name
                : image.name,
            commits: image.commits,
          })),
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
          toast: {
            type: MESSAGING_CONSTANTS.SUCCESS,
            message: MESSAGES.UPDATED,
          },
        }
      } else if (EXISTS_BY_NAME) {
        return {
          ...state,
          images: state.images.map((image) => ({
            name: image.name,
            commits:
              image.name === action.name
                ? JSON.stringify(action.commits)
                : image.commits,
          })),
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
          toast: {
            type: MESSAGING_CONSTANTS.SUCCESS,
            message: MESSAGES.UPDATED,
          },
        }
      } else {
        return {
          ...state,
          images: [
            ...state.images,
            {
              commits: JSON.stringify(action.commits),
              name: action.name,
            },
          ],
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
          toast: {
            type: MESSAGING_CONSTANTS.SUCCESS,
            message: MESSAGES.SAVED,
          },
        }
      }
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
    case ACTIONS.LOAD:
      return {
        ...state,
        selected: action.selected,
        cleared: new Date().toUTCString(),
      }
    case ACTIONS.WIPE:
      return {
        ...state,
        cleared: new Date().toUTCString(),
        selected: '',
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
    {
      cleared,
      username,
      repository,
      branch,
      muted,
      toast,
      images,
      generating,
      selected,
    },
    dispatch,
  ] = useReducer(APP_REDUCER, INITIAL_STATE)
  const [hideVincent, setHideVincent] = useState(false)
  const [dirty, setDirty] = useState(false)
  const nameInput = useRef(null)
  const { play: clickPlay } = useSound(CLICK_PATH)
  const { play: sparklePlay } = useSound(SPARKLE_PATH)
  const { play: brushPlay } = useSound(BRUSH_PATH)
  const { play: trumpetPlay } = useSound(TRUMPET_PATH)

  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))

  // Utility function to make sure days match the number of cells
  // for the current day.
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

  const onSelect = (e) => {
    // console.info(e.target.value)
    // This one is to keep the select in sync. Set selected in the dispatch
    // setImage(e.target.value)
    if (e.target.value === SELECT_PLACEHOLDER) {
      return dispatch({
        type: ACTIONS.LOAD,
        selected: '',
      })
    }
    const { name, commits } = JSON.parse(e.target.value)
    // Update the input ref
    nameInput.current.value = name
    cellsRef.current = sanitizeDays(
      JSON.parse(commits),
      NUMBER_OF_DAYS
    ).map((value) => parseInt(value, 10))
    console.info('getting here???')
    // Trick to re-render the commit grid without using state for cells
    setDirty(true)
    if (!muted) sparklePlay()
    dispatch({
      type: ACTIONS.LOAD,
      selected: e.target.value,
    })
  }

  const onGenerate = async () => {
    if (!muted) clickPlay()
    dispatch({
      type: ACTIONS.GENERATE,
    })
  }

  const onSave = () => {
    // Probably better here to grab the ref value??
    // And then set it via props if we can?
    if (!muted) clickPlay()
    dispatch({
      type: ACTIONS.SAVE,
      commits: cellsRef.current,
      name: nameInput.current.value,
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
      nameInput.current.value = ''
      setDirty(false)
      if (!muted) brushPlay()
      dispatch({
        type: ACTIONS.WIPE,
      })
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
          images={images}
          selectedImage={selected}
          dirty={dirty}
          onSelect={onSelect}
          disabled={!disabled}
          onGenerate={onGenerate}
          onWipe={onWipe}
          onSave={onSave}
          nameRef={nameInput}
        />
      </div>
      {generating && <Progress hide={hideVincent} onComplete={onProgressEnd} />}
      <AudioToggle onToggle={toggleAudio} />
      <Toasts toast={toast} />
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
