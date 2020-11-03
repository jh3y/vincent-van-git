import T from 'prop-types'
import React, { useState, Fragment } from 'react'
import AudioOff from '../../assets/icons/volume-off.svg'
import AudioOn from '../../assets/icons/volume-on.svg'

const AudioToggle = ({ muted: propsMuted, onToggle }) => {
  const [muted, setMuted] = useState(propsMuted)
  const toggle = () => {
    setMuted(!muted)
    if (onToggle) onToggle()
  }
  return (
    <Fragment>
      <input id="audio" type="checkbox" onChange={toggle} />
      <label
        htmlFor="audio"
        title="Toggle audio"
        className="icon-button audio-toggle">
        {muted ? <AudioOff /> : <AudioOn />}
      </label>
    </Fragment>
  )
}

AudioToggle.propTypes = {
  muted: T.bool,
  onToggle: T.func,
}

export default AudioToggle
