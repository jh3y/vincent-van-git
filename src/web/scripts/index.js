import React, { useEffect, useState, useRef, useReducer, Fragment } from 'react'
import { render } from 'react-dom'
import CommitGrid from '../../shared/components/commit-grid'
import InfoDrawer from '../../shared/components/info-drawer'
import SettingsDrawer from '../../shared/components/settings-drawer'
import Actions from '../../shared/components/actions'
import Progress from '../../shared/components/progress'
import Toasts from '../../shared/components/toasts'
import useSound from '../../shared/hooks/useSound'
import { MESSAGES } from '../../shared/constants'
import CLICK_PATH from '../../shared/assets/audio/click.mp3'
import SPARKLE_PATH from '../../shared/assets/audio/sparkle.mp3'
import TRUMPET_PATH from '../../shared/assets/audio/trumpet-fanfare.mp3'
import BRUSH_PATH from '../../shared/assets/audio/brush-stroke.mp3'

import 'regenerator-runtime/runtime'
import '../styles/index.styl'
import '../../shared/styles/shared.styl'

const ROOT_NODE = document.querySelector('#app')

const URL = '/.netlify/functions/vincent'
const App = () => {
  const [coding, setCoding] = useState(false)
  const [cleared, setCleared] = useState(null)
  const [toast, setToast] = useState(null)
  const [muted, setMuted] = useState(false)
  const [generating, setGenerating] = useState(false)
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
    console.info('cool')
    const resp = await (await fetch(URL)).json()
    console.info(resp)
  }

  const checkDirty = () => {
    setDirty(cellsRef.current.filter((cell) => cell !== 0).length > 0)
  }

  const onWipe = () => {
    if (!muted) clickPlay()
    if (confirm(MESSAGES.CONFIRM_WIPE)) {
      cellsRef.current = new Array(NUMBER_OF_DAYS).fill(0)
      setImage('') // Setting to empty string to select default.
      setImageName('')
      setCleared(new Date().toUTCString())
      setDirty(false)
      if (!muted) brushPlay()
      // ipcRenderer.send(MESSAGING_CONSTANTS.INFO, {
      //   message: MESSAGES.WIPED,
      // })
    }
  }

  return (
    <Fragment>
      <SettingsDrawer />
      <InfoDrawer />
      <div className="canvas">
        <CommitGrid key={cleared} cells={cellsRef.current} onChange={checkDirty} />
        <Actions disabled={!dirty} onGenerate={onGenerate} onWipe={onWipe} />
      </div>
      {(coding || generating) && <Progress />}
      <Toasts toast={toast} />
    </Fragment>
  )
}

// Set up all the config hooks, etc. and pass them through to app at this point perhaps??
// TODO:: Rebind these events.
// 1.
// IPCRENDERER CALL TO CLOSE SETTINGS MENU ON SAVE... OR TO CLOSE ONCE SAVED TO LOCAL STORAGE.
// useEffect(() => {
//   ipcRenderer.on(MESSAGING_CONSTANTS.UPDATED, (event, args) => {
//     if (!args.silent) {
//       setOpen(false)
//     }
//   })
// }, [])
// 2.
// Handle onSubmit for settings form. Either do an ipcRenderer call or dispatch an action for useReducer?
// const onSubmit = (config) => {
//   if (!muted) clickPlay()
//   ipcRenderer.send(MESSAGING_CONSTANTS.UPDATE, {
//     config,
//     silent: false,
//   })
// }

render(<App />, ROOT_NODE)
