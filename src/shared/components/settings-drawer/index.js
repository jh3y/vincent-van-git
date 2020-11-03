import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Cog from '../../assets/icons/cog.svg'
import useSound from '../../hooks/useSound'
import Drawer from '../drawer'
import './settings-drawer.styl'

const SettingsDrawer = (props) => {
  const [close, setClose] = useState(false)
  const { username, branch, repository, onSubmit } = props
  const { handleSubmit, register, setValue } = useForm()
  useEffect(() => {
    for (const key of ['username', 'repository', 'branch']) {
      setValue(key, props[key])
    }
  }, [props, setValue])

  const preSubmit = (values) => {
    setClose(true)
    console.info('hello?')
    if (onSubmit) onSubmit(values)
  }

  return (
    <Drawer
      title="Settings"
      close={close}
      onClose={() => setClose(false)}
      left={true}
      icon={Cog}>
      <form className="sliding-drawer__form" onSubmit={handleSubmit(preSubmit)}>
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
    </Drawer>
  )
}
SettingsDrawer.defaultProps = {
  onSubmit: () => {},
}

export default SettingsDrawer
