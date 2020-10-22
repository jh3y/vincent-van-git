import React, { useEffect, useRef, useState } from 'react'
const { ipcRenderer } = require('electron')
import { useForm } from 'react-hook-form'
import Cog from '../icons/cog.svg'
import { MESSAGING_CONSTANTS } from '../../../../constants'
import './settings-drawer.styl'

const SettingsDrawer = (props) => {
  const drawerRef = useRef(null)
  const { handleSubmit, register, setValue } = useForm()
  const onSubmit = (values) => {
    ipcRenderer.send(MESSAGING_CONSTANTS.UPDATE, values)
  }
  const [open, setOpen] = useState(false)

  const toggleMenu = () => {
    setOpen(!open)
  }

  useEffect(() => {
    for (const key of ['username', 'repository', 'branch']) {
      setValue(key, props[key])
    }
  }, [props.username, props.repository, props.branch])

  useEffect(() => {
    ipcRenderer.on(MESSAGING_CONSTANTS.UPDATED, (event, args) => {
      setOpen(false)
      alert(args.message)
    })
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--open', open ? 1 : 0)
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
    <div className="settings-drawer" ref={drawerRef}>
      <button
        title={`${open ? 'Close' : 'Open'} settings`}
        className="settings-drawer__toggle icon-button"
        onClick={toggleMenu}>
        <Cog />
      </button>
      <form className="settings-drawer__form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Settings</h2>
        <div className="settings-drawer__form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            required
            ref={register()}
          />
        </div>
        <div className="settings-drawer__form-field">
          <label htmlFor="repository">Repository</label>
          <input
            id="repository"
            name="repository"
            required
            ref={register()}
          />
        </div>
        <div className="settings-drawer__form-field">
          <label htmlFor="branch">Branch</label>
          <input
            id="branch"
            required
            name="branch"
            ref={register()}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default SettingsDrawer
