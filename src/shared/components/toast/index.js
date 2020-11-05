import T from 'prop-types'
import React, { useEffect } from 'react'
import Close from '../../assets/icons/close.svg'
import { MESSAGING_CONSTANTS } from '../../constants'
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
  type: T.oneOf([
    MESSAGING_CONSTANTS.INFO,
    MESSAGING_CONSTANTS.ERROR,
    MESSAGING_CONSTANTS.SUCCESS,
  ]),
  onDismiss: T.func,
  autoDismiss: T.number,
}

export default Toast
