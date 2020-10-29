import React, { useEffect, useState, useRef, useReducer, Fragment } from 'react'
import { render } from 'react-dom'
// import { gsap } from 'gsap'
import 'regenerator-runtime/runtime'
import '../styles/index.styl'

const ROOT_NODE = document.querySelector('#app')

const URL = '/.netlify/functions/vincent'
const App = () => {
  const generateScript = async () => {
    console.info('cool')
    const resp = await(await fetch(URL)).json()
    console.info(resp)
  }

  return (
    <div>
      <h1>Test Shell Script Generation</h1>
      <button onClick={generateScript}>Generate</button>
    </div>
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

render(<App/>, ROOT_NODE)