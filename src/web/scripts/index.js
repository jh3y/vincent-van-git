import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  Fragment,
} from 'react'
import { render } from 'react-dom'
import zip from 'jszip'
import CommitGrid from '../../shared/components/commit-grid'
import InfoDrawer from '../../shared/components/info-drawer'
import SettingsDrawer from '../../shared/components/settings-drawer'
import Actions from '../../shared/components/actions'
import Progress from '../../shared/components/progress'
import Toasts from '../../shared/components/toasts'
import Intro from '../../shared/components/intro'
import AudioToggle from '../../shared/components/audio-toggle'
import useSound from '../../shared/hooks/useSound'
import GitHubLink from '../../shared/components/links'

import {
  MESSAGES,
  ACTIONS,
  SELECT_PLACEHOLDER,
  TOASTS,
  README,
} from '../../shared/constants'

import { downloadFile, generateShellScript } from './shell'
import CLICK_PATH from '../../shared/assets/audio/click.mp3'
import SPARKLE_PATH from '../../shared/assets/audio/sparkle.mp3'
import TRUMPET_PATH from '../../shared/assets/audio/trumpet-fanfare.mp3'
import BRUSH_PATH from '../../shared/assets/audio/brush-stroke.mp3'

import 'regenerator-runtime/runtime'
import '../../shared/styles/shared.styl'
import { usePersistentReducer, APP_REDUCER } from './reducer'

const ROOT_NODE = document.querySelector('#app')
const REPO_PATH = '.vincents-canvas'

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
      showIntro,
    },
    dispatch,
  ] = usePersistentReducer(APP_REDUCER, undefined, ['toast'])
  const [hideVincent, setHideVincent] = useState(false)
  const [dirty, setDirty] = useState(selected !== '')
  const inputRef = useRef(null)
  const errorRef = useRef(null)
  const { play: clickPlay } = useSound(CLICK_PATH)
  const { play: sparklePlay } = useSound(SPARKLE_PATH)
  const { play: brushPlay } = useSound(BRUSH_PATH)
  const { play: trumpetPlay } = useSound(TRUMPET_PATH)
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(
    selected
      ? JSON.parse(JSON.parse(selected).commits)
      : new Array(NUMBER_OF_DAYS).fill(0)
  )

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

  useEffect(() => {
    if (selected.trim() !== '' && inputRef.current)
      inputRef.current.value = JSON.parse(selected).name
  }, [selected])

  const onDelete = () => {
    if (!muted) clickPlay()
    const name = JSON.parse(selected).name
    if (window.confirm(MESSAGES.CONFIRM_DELETE(name))) {
      inputRef.current.value = ''
      dispatch({
        type: ACTIONS.DELETE,
        name,
      })
    }
  }

  const onSelect = (e) => {
    // This one is to keep the select in sync. Set selected in the dispatch
    if (e.target.value === SELECT_PLACEHOLDER) {
      inputRef.current.value = ''
      return dispatch({
        type: ACTIONS.LOAD,
        selected: '',
      })
    }
    const { name, commits } = JSON.parse(e.target.value)
    // Update the input ref
    inputRef.current.value = name
    cellsRef.current = sanitizeDays(
      JSON.parse(commits),
      NUMBER_OF_DAYS
    ).map((value) => parseInt(value, 10))
    // Trick to re-render the commit grid without using state for cells
    setDirty(true)
    if (!muted) sparklePlay()
    dispatch({
      type: ACTIONS.LOAD,
      selected: e.target.value,
    })
  }

  const onGenerate = () => {
    if (!muted) clickPlay()
    if (window.confirm(MESSAGES.CONFIRM_DOWNLOAD)) {
      dispatch({
        type: ACTIONS.GENERATE,
      })
    }
  }

  const onSave = () => {
    if (!muted) clickPlay()
    dispatch({
      type: ACTIONS.SAVE,
      commits: cellsRef.current,
      name: inputRef.current.value,
    })
  }

  useEffect(() => {
    const getMultiplier = async () => {
      try {
        dispatch({
          type: ACTIONS.TOASTING,
          toast: {
            type: TOASTS.INFO,
            message: MESSAGES.CHECKING,
            life: 2000,
          },
        })
        const resp = await fetch(
          `${URL}?username=${username}&repository=${repository}&branch=${branch}`
        )
        if (resp.status !== 200) {
          const ERROR = await resp.json()
          errorRef.current = ERROR.message
          dispatch({
            type: ACTIONS.TOASTING,
            toast: {
              type: TOASTS.ERROR,
              message: ERROR.message,
              life: 0,
            },
          })
          setHideVincent(true)
        } else {
          const multiplier = await (await resp.json()).multiplier
          dispatch({
            type: ACTIONS.TOASTING,
            toast: {
              type: TOASTS.INFO,
              message: MESSAGES.MAX(multiplier),
              life: 2000,
            },
          })
          setTimeout(async () => {
            const SCRIPT = await generateShellScript(
              cellsRef.current,
              username,
              multiplier,
              repository,
              branch,
              REPO_PATH,
              dispatch
            )
            const FILE = new zip()
            FILE.file('vincent-van-git.sh', SCRIPT)
            FILE.file('README.md', README)
            const ZIP_FILE = await FILE.generateAsync({ type: 'blob' })
            downloadFile(ZIP_FILE, 'vincent-van-git.zip')
            setHideVincent(true)
          }, 5000)
        }
      } catch (err) {
        errorRef.current = err.message
        dispatch({
          type: ACTIONS.TOASTING,
          toast: {
            type: TOASTS.ERROR,
            message: err.message,
            life: 0,
          },
        })
        setHideVincent(true)
      }
    }
    if (generating) {
      getMultiplier()
    } else {
      setHideVincent(false)
      if (errorRef.current) errorRef.current = null
    }
  }, [generating, branch, dispatch, repository, username])

  const onSettingsUpdate = (settings) => {
    if (!muted) clickPlay()
    dispatch({
      type: ACTIONS.SETTINGS,
      ...settings,
    })
  }

  const onProgressEnd = () => {
    dispatch({
      silent: errorRef.current,
      type: ACTIONS.GENERATE,
    })
    if (!errorRef.current) trumpetPlay()
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

  const onDismiss = () => {
    if (!muted) clickPlay()
    dispatch({
      type: ACTIONS.DISMISS,
    })
  }

  const onWipe = () => {
    if (!muted) clickPlay()
    if (window.confirm(MESSAGES.CONFIRM_WIPE)) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      inputRef.current.value = ''
      setDirty(false)
      if (!muted) brushPlay()
      dispatch({
        type: ACTIONS.WIPE,
      })
    }
  }

  const importFile = useCallback(
    (content) => {
      const READER = new FileReader()
      READER.onload = (e) => {
        // Loop over the import.
        // If the name doesn't exist, import it.
        // If the name exists and the value differs from what exists, import with a different name.
        const NEW_IMAGES = []
        const IMPORTS = JSON.parse(e.target.result)
        for (const importImage of IMPORTS) {
          const EXISTS_BY_NAME =
            images.filter((image) => image.name === importImage.name).length > 0
          const EXISTS_BY_VALUE =
            images.filter((image) => image.commits === importImage.commits)
              .length > 0
          if (EXISTS_BY_NAME && !EXISTS_BY_VALUE) {
            NEW_IMAGES.push({
              name: `${importImage.name} (Imported)`,
              commits: importImage.commits,
            })
          } else if (!EXISTS_BY_NAME && !EXISTS_BY_VALUE) {
            // Import it
            NEW_IMAGES.push({
              name: importImage.name,
              commits: importImage.commits,
            })
          }
        }
        dispatch({
          type: ACTIONS.IMPORT,
          imports: NEW_IMAGES,
        })
        if (!muted && NEW_IMAGES.length > 0) sparklePlay()
      }
      READER.readAsText(content)
    },
    [images, dispatch, muted, sparklePlay]
  )

  const onImport = () => {
    if (!muted) clickPlay()
    // Import is a little trickier. Need to read a file and then translate its content into new state variables.
    const CHOOSE = document.createElement('input')
    CHOOSE.type = 'file'
    CHOOSE.setAttribute('accept', '.json')
    const handleFileSelect = (e) => {
      if (e.target) {
        const FILE = e.target.files[0]
        if (FILE.name === 'vincent-van-git.config.json') {
          importFile(FILE)
        } else {
          dispatch({
            type: ACTIONS.TOASTING,
            toast: {
              type: TOASTS.ERROR,
              message: MESSAGES.JSON,
              life: 0,
            },
          })
        }
        CHOOSE.remove()
      }
    }
    CHOOSE.addEventListener('input', handleFileSelect)
    CHOOSE.click()
  }

  const onExport = () => {
    if (!muted) clickPlay()
    const FILE = new Blob([JSON.stringify(images)], {
      type: 'application/json',
    })
    downloadFile(FILE, 'vincent-van-git.config.json')
    dispatch({
      type: ACTIONS.TOASTING,
      toast: {
        type: TOASTS.SUCCESS,
        message: MESSAGES.EXPORTED,
        life: 2000,
      },
    })
  }

  useEffect(() => {
    const moot = (e) => e.preventDefault()
    const onFileDrop = (e) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file.name === 'vincent-van-git.config.json') importFile(file)
    }
    // Don't do anything on drag over
    document.body.addEventListener('dragover', moot)
    document.body.addEventListener('drop', onFileDrop)
    return () => {
      document.body.removeEventListener('dragover', moot)
      document.body.removeEventListener('drop', onFileDrop)
    }
  }, [importFile])

  const disabled =
    generating || !dirty || (dirty && !(username || repository || branch))

  return (
    <Fragment>
      {showIntro && <Intro onDismiss={onDismiss} />}
      <SettingsDrawer
        username={username}
        repository={repository}
        branch={branch}
        muted={muted}
        onSubmit={onSettingsUpdate}
      />
      <InfoDrawer muted={muted} />
      <div className="canvas">
        <CommitGrid
          key={cleared}
          muted={muted}
          cells={cellsRef.current}
          onChange={checkDirty}
        />
        <Actions
          images={images}
          generating={generating}
          selectedImage={selected}
          onImport={onImport}
          onExport={onExport}
          dirty={dirty}
          onSelect={onSelect}
          disabled={disabled}
          onDelete={onDelete}
          onGenerate={onGenerate}
          onWipe={onWipe}
          onSave={onSave}
          nameRef={inputRef}
          cellsRef={cellsRef}
        />
      </div>
      {generating && <Progress hide={hideVincent} onComplete={onProgressEnd} />}
      <AudioToggle onToggle={toggleAudio} muted={muted} />
      <GitHubLink />
      <Toasts toast={toast} />
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
