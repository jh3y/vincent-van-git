import React, { useRef } from 'react'
import T from 'prop-types'
import { MonoSynth } from 'tone/build/Tone'
import BRUSH_PATH from '../../assets/images/brush.png'
import './commit-grid.styl'

const MAX_LEVEL = 4

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const PITCH = [5, 4, 3, 2]

export default function CommitGrid({
  cells = [],
  onChange = () => {},
  muted = false,
  startOffset = 0,
  endOffset = 0,
  startDate = null,
}) {
  const gridRef = useRef(null)
  const rendered = useRef(null)
  const erasing = useRef(null)
  const synthRef = useRef(null)

  const playNote = (index, level) => {
    if (!synthRef.current) {
      synthRef.current = new MonoSynth({
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
            1.2732395447351628, 0, 0.4244131815783876, 0, 0.25464790894703254,
            0, 0.18189136353359467, 0,
          ],
          phase: 0,
          type: 'square8',
        },
      }).toDestination()
    }
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
      // Don't allow interaction with offset cells
      if (INDEX < startOffset || INDEX >= cells.length - endOffset) {
        return
      }
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
      className="commit-grid"
    >
      {cells.map((cell, index) => {
        const COLUMN = Math.floor(index / 7) + 1
        const isOffsetCell =
          index < startOffset || index >= cells.length - endOffset

        // Calculate the date for this cell
        // The first cell (index 0) represents the Sunday of the week containing the start date
        // So we subtract startOffset days from the start date to get the first cell's date
        let cellDate = null
        if (startDate) {
          const cellDateObj = new Date(startDate)
          cellDateObj.setDate(cellDateObj.getDate() - startOffset + index)
          cellDate = cellDateObj.toISOString().split('T')[0] // Format as YYYY-MM-DD
        }

        return (
          <div
            style={{
              '--column': COLUMN,
            }}
            className={`commit-grid__cell ${
              isOffsetCell ? 'commit-grid__cell--offset' : ''
            }`}
            data-level={cell || 0}
            data-index={index}
            data-date={cellDate || ''}
            key={index}
          ></div>
        )
      })}
    </div>
  )
}

CommitGrid.propTypes = {
  cells: T.arrayOf(T.number),
  onChange: T.func,
  muted: T.bool,
  startOffset: T.number,
  endOffset: T.number,
  startDate: T.instanceOf(Date),
}
