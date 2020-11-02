import React, { useEffect } from 'react'
import Close from '../../assets/icons/close.svg'
import './toast.styl'

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
      <button title="Dismiss" onClick={onDismiss}>
        <Close />
      </button>
    </div>
  )
}

export default Toast