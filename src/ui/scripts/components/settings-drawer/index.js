import React, { useEffect, useRef, useState } from 'react'
const { ipcRenderer } = require('electron')
import { useForm } from 'react-hook-form'
import Cog from '../icons/cog.svg'
import { MESSAGING_CONSTANTS } from '../../../../constants'
import useSound from '../../hooks/useSound'
import './settings-drawer.styl'

const SettingsDrawer = (props) => {
  const { play: clickPlay } = useSound(
    'https://assets.codepen.io/605876/click.mp3'
  )
  const drawerRef = useRef(null)
  const { handleSubmit, register, setValue } = useForm()
  const onSubmit = (config) => {
    if (!props.muted) clickPlay()
    ipcRenderer.send(MESSAGING_CONSTANTS.UPDATE, {
      config,
      silent: false,
    })
  }

  const [open, setOpen] = useState(false)

  const toggleMenu = () => {
    if (!props.muted) clickPlay()
    setOpen(!open)
  }

  useEffect(() => {
    for (const key of ['username', 'repository', 'branch']) {
      setValue(key, props[key])
    }
  }, [props.username, props.repository, props.branch])

  useEffect(() => {
    ipcRenderer.on(MESSAGING_CONSTANTS.UPDATED, (event, args) => {
      if (!args.silent) {
        setOpen(false)
      }
    })
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--settings', open ? 1 : 0)
    const handleClick = ({ target }) => {
      if (drawerRef.current !== target && !drawerRef.current.contains(target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('click', handleClick)
    } else {
      document.removeEventListener('click', handleClick)
    }
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [open])

  return (
    <div className="sliding-drawer sliding-drawer--settings" ref={drawerRef}>
      <button
        title={`${open ? 'Close' : 'Open'} settings`}
        className="sliding-drawer__toggle sliding-drawer__toggle--settings icon-button"
        onClick={toggleMenu}>
        <Cog />
      </button>
      <form className="sliding-drawer__form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="sliding-drawer__title">Settings</h2>
        <div className="sliding-drawer__form-field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" required ref={register()} />
        </div>
        <div className="sliding-drawer__form-field">
          <label htmlFor="repository">Repository</label>
          <input id="repository" name="repository" required ref={register()} />
        </div>
        <div className="sliding-drawer__form-field">
          <label htmlFor="branch">Branch</label>
          <input id="branch" required name="branch" ref={register()} />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default SettingsDrawer
