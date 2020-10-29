import React, { useEffect, useState, useRef, useReducer, Fragment } from 'react'
import { render } from 'react-dom'
// import { gsap } from 'gsap'
import 'regenerator-runtime/runtime'
import '../styles/index.styl'

const ROOT_NODE = document.querySelector('#app')

const FUNCTION_PATH = '/.netlify/functions/vincent'

const downloadFile = (content, type, name) => {
  const FILE = new Blob([content], { type: type })
  const FILE_URL = URL.createObjectURL(FILE)
  const link = document.createElement('a')
  link.href = FILE_URL
  link.download = name || `${STORAGE_KEY}-creation`
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(FILE_URL)
  link.remove()
}

const App = () => {
  const generateScript = async () => {
    const resp = await(await fetch(FUNCTION_PATH)).json()
    downloadFile(resp.script, 'text', 'vincent.van.git.sh')
  }

  return (
    <div>
      <h1>Test Shell Script Generation</h1>
      <button onClick={generateScript}>Generate</button>
    </div>
  )
}

render(<App/>, ROOT_NODE)