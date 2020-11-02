import React, { useEffect, useState, useRef, useReducer, Fragment } from 'react'
import { render } from 'react-dom'
import CommitGrid from '../../shared/components/commit-grid'
import InfoDrawer from '../../shared/components/info-drawer'
import SettingsDrawer from '../../shared/components/settings-drawer'
import Actions from '../../shared/components/actions'
import Progress from '../../shared/components/progress'

import 'regenerator-runtime/runtime'
import '../styles/index.styl'
import '../../shared/styles/shared.styl'

const ROOT_NODE = document.querySelector('#app')

const URL = '/.netlify/functions/vincent'
const App = () => {
  const [coding, setCoding] = useState(false)
  const [generating, setGenerating] = useState(false)
  const NUMBER_OF_DAYS = 52 * 7 + (new Date().getDay() + 1)
  const cellsRef = useRef(new Array(NUMBER_OF_DAYS).fill(0))

  const generateScript = async () => {
    console.info('cool')
    const resp = await (await fetch(URL)).json()
    console.info(resp)
  }

  return (
    <Fragment>
      <SettingsDrawer />
      <InfoDrawer />
      <div className='canvas'>
        <CommitGrid cells={cellsRef.current} />
        <Actions />
      </div>
      {(coding || generating) && <Progress />}
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
