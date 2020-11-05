import T from 'prop-types'
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

  useEffect(() => {
    const createToast = (message, type, life = DISMISS) => {
      const TOAST_TIME = DateTime.local().toISO({ includeOffset: true })
      const TOAST = {
        created: TOAST_TIME,
        type,
        message,
        autoDismiss: life,
        onDismiss: onDismiss(TOAST_TIME),
      }
      return TOAST
    }
    if (toastToAdd) {
      const NEW_TOAST = createToast(
        toastToAdd.message,
        toastToAdd.type,
        toastToAdd.life
      )
      setToast(NEW_TOAST)
    }
  }, [toastToAdd])

  useEffect(() => {
    if (
      toast &&
      toasts.filter((t) => t.created === toast.created).length === 0
    ) {
      // Adds toasts into pile
      setToasts([...toasts, toast])
    }
  }, [toast, toasts])

  useEffect(() => {
    if (
      toasts.length &&
      toast &&
      toasts.filter((t) => t.created === toast.created).length !== 0
    ) {
      gsap.from(`[data-toast="${toast.created}"]`, {
        xPercent: 100,
        opacity: 0,
        onStart: () => setToast(null),
      })
    }
  }, [toast, toasts])

  useEffect(() => {
    if (remove) {
      setToasts([...toasts.filter((t) => t.created !== remove)])
      setRemove(null)
    }
  }, [remove, toasts])

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

Toasts.propTypes = {
  toast: T.shape({
    created: T.string,
    message: T.string,
    type: T.oneOf(['ERROR', 'INFO', 'SUCCESS']),
  }),
}

export default Toasts
