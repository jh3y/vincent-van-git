import { useRef } from 'react'

const useSound = (path) => {
  const soundRef = useRef(new Audio(path))
  const play = () => {
    soundRef.current.currentTime = 0
    soundRef.current.play()
  }
  const pause = () => soundRef.current.pause()
  const stop = () => {
    soundRef.current.pause()
    soundRef.current.currentTime = 0
  }
  return {
    play,
    stop,
    pause,
  }
}

export default useSound