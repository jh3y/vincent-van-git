import React, { useEffect, useRef, useState } from 'react'
import useSound from '../../hooks/useSound'
import CLICK_PATH from '../../assets/audio/click.mp3'
import './drawer.styl'

const SettingsDrawer = ({
  title,
  open: isOpen,
  children,
  icon: Icon,
  close,
  left = true,
  muted = false,
  onClose,
}) => {
  const { play: clickPlay } = useSound(CLICK_PATH)
  const drawerRef = useRef(null)
  const [open, setOpen] = useState(isOpen)

  const toggleMenu = () => {
    if (!muted) clickPlay()
    setOpen(!open)
  }

  useEffect(() => {
    if (close) setOpen(false)
  }, [close])

  useEffect(() => {
    if (!open && onClose) onClose()
  }, [open, onClose])

  useEffect(() => {
    console.info('change??')
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    const handleClick = ({ target }) => {
      if (drawerRef.current !== target && !drawerRef.current.contains(target)) {
        setOpen(false)
      }
    }
    document.documentElement.style.setProperty(
      left ? '--left' : '--right',
      open ? 1 : 0
    )
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
    <div
      className={`sliding-drawer sliding-drawer--${left ? 'left' : 'right'}`}
      ref={drawerRef}>
      <button
        title={`${open ? 'Close' : 'Open'} menu`}
        className={`sliding-drawer__toggle sliding-drawer__toggle--${
          left ? 'left' : 'right'
        } icon-button`}
        onClick={toggleMenu}>
        <Icon />
      </button>
      <div className="sliding-drawer__content">
        {title && <h2 className="sliding-drawer__title">{title}</h2>}
        {children}
      </div>
    </div>
  )
}

export default SettingsDrawer
