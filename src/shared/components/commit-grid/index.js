import React, { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import BRUSH_PATH from '../../assets/images/brush.png'
import './commit-grid.styl'

const MAX_LEVEL = 4

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const PITCH = [5, 4, 3, 2]

export default function CommitGrid({
  cells = [],
  onChange = () => {},
  muted = false,
}) {
  const gridRef = useRef(null)
  const rendered = useRef(null)
  const erasing = useRef(null)
  const synthRef = useRef(null)

  const playNote = (index, level) => {
    synthRef.current.triggerAttackRelease(
      `${NOTES[index]}${PITCH[level - 1]}`,
      '32n'
    )
  }

  const draw = (e) => {
    e.preventDefault()
    const cell =
      e.clientX && e.clientY
        ? document.elementFromPoint(e.clientX, e.clientY)
        : e.target
    if (
      cell &&
      cell.parentNode === gridRef.current &&
      rendered.current !== cell
    ) {
      rendered.current = cell
      const INDEX = parseInt(cell.getAttribute('data-index'), 10)
      const LEVEL = parseInt(cell.getAttribute('data-level'), 10) || 0
      if (erasing.current) {
        cell.setAttribute('data-level', 0)
        cells[INDEX] = 0
        if (!muted && LEVEL !== 0)
          synthRef.current.triggerAttackRelease('A2', '32n')
      } else {
        const NEW_LEVEL = Math.min(MAX_LEVEL, LEVEL + 1)
        if (NEW_LEVEL !== LEVEL) {
          cell.setAttribute('data-level', NEW_LEVEL)
          cells[INDEX] = NEW_LEVEL
          if (!muted) playNote(INDEX % 7, NEW_LEVEL)
        }
      }
      if (onChange) onChange()
    }
  }

  const stopDrawing = (e) => {
    e.preventDefault()
    rendered.current = null
    erasing.current = false
    window.removeEventListener('pointermove', draw)
    window.removeEventListener('pointerup', stopDrawing)
  }

  const startDrawing = (e) => {
    e.preventDefault()
    // If right mouse button, go into erase mode
    if (e.button === 2) {
      e.preventDefault()
      erasing.current = true
    }
    draw(e)
    window.addEventListener('pointermove', draw)
    window.addEventListener('pointerup', stopDrawing)
  }

  const moot = (e) => {
    e.preventDefault()
    return false
  }

  useEffect(() => {
    synthRef.current = new Tone.MonoSynth({
      volume: -8,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0.05,
        attackCurve: 'linear',
        decay: 0.3,
        decayCurve: 'exponential',
        release: 0.8,
        releaseCurve: 'exponential',
        sustain: 0.4,
      },
      filter: {
        Q: 1,
        detune: 0,
        frequency: 0,
        gain: 0,
        rolloff: -12,
        type: 'lowpass',
      },
      filterEnvelope: {
        attack: 0.001,
        attackCurve: 'linear',
        decay: 0.7,
        decayCurve: 'exponential',
        release: 0.8,
        releaseCurve: 'exponential',
        sustain: 0.1,
        baseFrequency: 300,
        exponent: 2,
        octaves: 4,
      },
      oscillator: {
        detune: 0,
        frequency: 440,
        partialCount: 8,
        partials: [
          1.2732395447351628,
          0,
          0.4244131815783876,
          0,
          0.25464790894703254,
          0,
          0.18189136353359467,
          0,
        ],
        phase: 0,
        type: 'square8',
      },
    }).toDestination()
    // synthRef.current.set({
    //   volume: -20
    // })
  }, [])

  if (!cells.length) return null

  return (
    <div
      onPointerDown={startDrawing}
      onContextMenu={moot}
      onDrag={moot}
      onDragEnd={moot}
      onDragEnter={moot}
      onDragExit={moot}
      onDragLeave={moot}
      onDragOver={moot}
      onDragStart={moot}
      ref={gridRef}
      style={{
        '--cursor': `url("${BRUSH_PATH}") 14 34, auto`,
      }}
      className="commit-grid">
      {cells.map((cell, index) => {
        const COLUMN = Math.floor(index / 7) + 1
        return (
          <div
            style={{
              '--column': COLUMN,
            }}
            className="commit-grid__cell"
            data-level={cell || 0}
            data-index={index}
            key={index}></div>
        )
      })}
    </div>
  )
}
