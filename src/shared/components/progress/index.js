import T from 'prop-types'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Vincent from '../vincent'
import './progress.styl'

const Progress = ({ onComplete, hide }) => {
  const progressRef = useRef(null)
  useEffect(() => {
    gsap.set(progressRef.current, { '--right': 100 })
    gsap.to(progressRef.current, {
      '--right': 0,
      duration: 1,
    })
  }, [])
  useEffect(() => {
    if (hide) {
      gsap.to(progressRef.current, {
        '--left': 100,
        duration: 1,
        onComplete: () => {
          if (onComplete) onComplete()
        },
      })
    }
  }, [hide, onComplete])
  return (
    <div
      ref={progressRef}
      className="progress-screen"
      style={{
        '--right': 100,
      }}>
      <Vincent />
    </div>
  )
}

Progress.propTypes = {
  onComplete: T.func,
  hide: T.bool,
}

export default Progress
