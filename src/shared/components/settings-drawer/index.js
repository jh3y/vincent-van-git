import T from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Cog from '../../assets/icons/cog.svg'
import Drawer from '../drawer'
import './settings-drawer.styl'

const SettingsDrawer = (props) => {
  const [close, setClose] = useState(false)
  const { onSubmit } = props
  const { handleSubmit, register, setValue } = useForm()
  useEffect(() => {
    for (const key of ['username', 'repository', 'branch']) {
      setValue(key, props[key])
    }
  }, [props, setValue])

  const preSubmit = (values) => {
    setClose(true)
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
        <button className="submit-button" type="submit">
          Save
        </button>
      </form>
    </Drawer>
  )
}
SettingsDrawer.defaultProps = {
  onSubmit: () => {},
}
SettingsDrawer.propTypes = {
  onSubmit: T.func,
}

export default SettingsDrawer
