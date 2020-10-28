import React, { useEffect, useRef, useState } from 'react'
import Information from '../icons/information-outline.svg'
import useSound from '../../hooks/useSound'
import './info-drawer.styl'

const SettingsDrawer = (props) => {
  const { play: clickPlay } = useSound('https://assets.codepen.io/605876/click.mp3')
  const drawerRef = useRef(null)
  const [open, setOpen] = useState(false)

  const toggleMenu = () => {
    if (!props.muted) clickPlay()
    setOpen(!open)
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--info', open ? 1 : 0)
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
    <div className="sliding-drawer sliding-drawer--info" ref={drawerRef}>
      <button
        title={`${open ? 'Close' : 'Open'} info`}
        className="sliding-drawer__toggle sliding-drawer__toggle--info icon-button"
        onClick={toggleMenu}>
        <Information />
      </button>
      <article>
        <h2 className="sliding-drawer__title">Info</h2>
        <section>
          <h3>Instructions</h3>
          <p>Left pointer to draw, right pointer to erase.</p>
        </section>
      </article>
    </div>
  )
}

export default SettingsDrawer
