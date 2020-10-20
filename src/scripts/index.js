import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import '../styles/index.styl'
import { MESSAGING_CONSTANTS } from '../constants'

console.info(MESSAGING_CONSTANTS)
// Now we can render our application into it
render(<App />, document.getElementById('root'))