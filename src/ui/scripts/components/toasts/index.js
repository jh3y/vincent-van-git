import React, { useEffect, useRef, useState } from 'react'
import { ipcRenderer } from 'electron'
import { DateTime } from 'luxon'
import gsap from 'gsap'
import { MESSAGING_CONSTANTS } from '../../../../constants'
import './toasts.styl'

const TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
}

const DISMISS = 3000

const Toast = ({ created, message, type, onDismiss, autoDismiss }) => {
  useEffect(() => {
    let timer
    if (autoDismiss) {
      timer = setTimeout(onDismiss, autoDismiss)
    }
    return () => clearTimeout(timer)
  }, [autoDismiss])
  return (
    <div data-toast={created} className={`toast toast--${type}`}>
      {message}
      {created}
      <button onClick={onDismiss}>Remove</button>
    </div>
  )
}

const Toasts = () => {
  const [toast, setToast] = useState(null)
  const [remove, setRemove] = useState(null)
  const [toasts, setToasts] = useState([])
  const onDismiss = (toastTime) => () => {
    console.info('Remove toast created at', toastTime)
    gsap.to(`[data-toast="${toastTime}"]`, {
      xPercent: 100,
      opacity: 0,
      onComplete: () => {
        setRemove(toastTime)
      },
    })
  }
  const createToast = (message, type) => {
    const TOAST_TIME = DateTime.local().toISO({ includeOffset: true })
    const TOAST = {
      created: TOAST_TIME,
      type,
      message,
      autoDismiss: type !== TYPES.ERROR ? DISMISS : 0,
      onDismiss: onDismiss(TOAST_TIME),
    }
    setToast(TOAST)
  }
  useEffect(() => {
    ipcRenderer.on(MESSAGING_CONSTANTS.INFO, (event, arg) => {
      if (!arg.silent && arg.message) createToast(arg.message, TYPES.INFO)
    })
    ipcRenderer.on(MESSAGING_CONSTANTS.SUCCESS, (event, arg) => {
      if (!arg.silent && arg.message) createToast(arg.message, TYPES.SUCCESS)
    })
    ipcRenderer.on(MESSAGING_CONSTANTS.ERROR, (event, arg) => {
      if (!arg.silent && arg.message) createToast(arg.message.message, TYPES.ERROR)
    })
  }, [])

  useEffect(() => {
    if (toast) {
      setToasts([...toasts, toast])
      setToast(null)
    }
  }, [toast])

  useEffect(() => {
    if (remove) {
      setToasts([...toasts.filter((t) => t.created !== remove)])
      setRemove(null)
    }
  }, [remove])

  return (
    <div className="toasts">
      {toasts.map((t) => (
        <Toast
          key={t.created}
          onDismiss={t.onDismiss}
          message={t.message}
          autoDismiss={t.autoDismiss}
          created={t.created}
          type={t.type}
        />
      ))}
    </div>
  )
}

export default Toasts
