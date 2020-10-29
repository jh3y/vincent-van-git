import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Cog from '../../assets/icons/cog.svg'
import useSound from '../../hooks/useSound'
import Drawer from '../drawer'
import './settings-drawer.styl'

const SettingsDrawer = (props) => {
  const { muted, username, branch, repository, open, onSubmit } = props
  const { play: clickPlay } = useSound(
    'https://assets.codepen.io/605876/click.mp3'
  )
  const { handleSubmit, register, setValue } = useForm()
  useEffect(() => {
    for (const key of ['username', 'repository', 'branch']) {
      setValue(key, props[key])
    }
  }, [username, repository, branch])

  return (
    <Drawer title="Settings" left={true} icon={Cog} open={open}>
      <form className="sliding-drawer__form" onSubmit={handleSubmit(onSubmit)}>
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
  onSubmit: () => {}
}

export default SettingsDrawer
