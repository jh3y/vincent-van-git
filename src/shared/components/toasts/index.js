import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import gsap from 'gsap'
import Toast from '../toast'
import './toasts.styl'

const TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
}

const DISMISS = 3000

const Toasts = ({ toast: toastToAdd }) => {
  const [toast, setToast] = useState(null)
  const [remove, setRemove] = useState(null)
  const [toasts, setToasts] = useState([])
  const onDismiss = (toastTime) => () => {
    gsap.to(`[data-toast="${toastTime}"]`, {
      xPercent: 100,
      opacity: 0,
      onComplete: () => {
        setRemove(toastTime)
      },
    })
  }
  // useEffect(() => {
  //   ipcRenderer.on(MESSAGING_CONSTANTS.INFO, (event, arg) => {
  //     if (!arg.silent && arg.message) createToast(arg.message, TYPES.INFO)
  //   })
  //   ipcRenderer.on(MESSAGING_CONSTANTS.SUCCESS, (event, arg) => {
  //     if (!arg.silent && arg.message) createToast(arg.message, TYPES.SUCCESS)
  //   })
  //   ipcRenderer.on(MESSAGING_CONSTANTS.ERROR, (event, arg) => {
  //     if (!arg.silent && arg.message)
  //       createToast(arg.message.message, TYPES.ERROR)
  //   })
  // }, [])

  const createToast = (message, type) => {
    const TOAST_TIME = DateTime.local().toISO({ includeOffset: true })
    const TOAST = {
      created: TOAST_TIME,
      type,
      message,
      autoDismiss: type !== TYPES.ERROR ? DISMISS : 0,
      onDismiss: onDismiss(TOAST_TIME),
    }
    return TOAST
  }

  useEffect(() => {
    if (toastToAdd) {
      const NEW_TOAST = createToast(toastToAdd.message, toastToAdd.type)
      setToast(NEW_TOAST)
    }
  }, [toastToAdd])

  useEffect(() => {
    if (toast) {
      setToasts([...toasts, toast])
    }
  }, [toast])

  useEffect(() => {
    if (
      toasts.length &&
      toast &&
      toasts.filter((t) => t.created === toast.created).length !== 0
    ) {
      gsap.from(`[data-toast="${toast.created}"]`, {
        xPercent: 100,
        opacity: 0,
        onStart: () => {
          setToast(null)
        },
      })
    }
  }, [toast, toasts])

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
