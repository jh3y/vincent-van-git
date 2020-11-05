import T from 'prop-types'
import React, { useEffect } from 'react'
import Close from '../../assets/icons/close.svg'
import { TOASTS } from '../../constants'
import './toast.styl'

const Toast = ({ created, message, type, onDismiss, autoDismiss }) => {
  useEffect(() => {
    let timer
    if (autoDismiss) {
      timer = setTimeout(onDismiss, autoDismiss)
    }
    return () => clearTimeout(timer)
  }, [autoDismiss, onDismiss])
  return (
    <div data-toast={created} className={`toast toast--${type}`}>
      {message}
      <button title="Dismiss" onClick={onDismiss}>
        <Close />
      </button>
    </div>
  )
}

Toast.propTypes = {
  created: T.string,
  message: T.string,
  type: T.oneOf([TOASTS.INFO, TOASTS.ERROR, TOASTS.SUCCESS]),
  onDismiss: T.func,
  autoDismiss: T.number,
}

export default Toast
