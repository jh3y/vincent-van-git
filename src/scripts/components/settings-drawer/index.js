import React, { useEffect, useRef, useState } from 'react'
const { ipcRenderer } = require('electron')
import { useForm } from 'react-hook-form'
import './settings-drawer.styl'

const SettingsDrawer = (props) => {
  const { handleSubmit, register, setValue } = useForm()
  const onSubmit = (values) => {
    ipcRenderer.send('update-config', values)
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

  return (
    <div
      className="settings-drawer"
      style={{
        '--open': open ? 1 : 0,
      }}>
      <button className="settings-drawer__toggle" onClick={toggleMenu}>
        Toggle Menu
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form__field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            ref={register({
              required: 'Required',
            })}
          />
        </div>
        <div className="form__field">
          <label htmlFor="repository">Repository</label>
          <input
            id="repository"
            name="repository"
            ref={register({
              required: 'Required',
            })}
          />
        </div>
        <div className="form__field">
          <label htmlFor="branch">Branch</label>
          <input
            id="branch"
            name="branch"
            ref={register({
              required: 'Required',
            })}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default SettingsDrawer
