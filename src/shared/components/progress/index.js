import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Vincent from '../vincent'
import './progress.styl'
// hide === (coding || uploading || submitted)
// onComplete === setCoding(false)
// setUploading(false)
// setSubmitted(false)
// setError(false)
// gsap.set(progressRef.current, {
//   '--left': 0,
//   '--right': 100,
// })

const TIMING = {
  SLIDE: 1,
  BUFFER: 2,
}

const Progress = ({ error, message, onComplete, hide }) => {
  const progressRef = useRef(null)

  // React to hide, hide it with GSAP and then do an onComplete prop?
  useEffect(() => {
    // Animate it in?
    gsap.set(progressRef.current, { '--right': 100 })
    gsap.to(progressRef.current, {
      '--right': 0,
      duration: TIMING.SLIDE,
    })
  }, [])
  useEffect(() => {
    let timer
    if (hide) {
      timer = setTimeout(
        () => {
          gsap.to(progressRef.current, {
            '--left': 100,
            duration: TIMING.SLIDE,
            onComplete: () => {
              if (onComplete) onComplete()
            },
          })
        },
        error ? TIMING.BUFFER * 500 : TIMING.BUFFER * 1000
      )
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [hide])
  return (
    <div
      ref={progressRef}
      className="progress-screen"
      style={{
        '--right': 100,
      }}>
      <Vincent />
      <h1 className="progress-screen__message">{message}</h1>
    </div>
  )
}

export default Progress
