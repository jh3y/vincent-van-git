import React, { useEffect, useRef } from 'react'
import './commit-grid.styl'

export default function CommitGrid({ cells }) {
  const gridRef = useRef(null)
  const rendered = useRef(null)
  const erasing = useRef(null)
  const draw = (e) => {
    const cell =
      e.clientX && e.clientY
        ? document.elementFromPoint(e.clientX, e.clientY)
        : e.target
    if (cell && cell.parentNode === gridRef.current && rendered.current !== cell) {
      rendered.current = cell
      const INDEX = parseInt(cell.getAttribute('data-index'), 10)
      if (erasing.current) {
        cell.setAttribute('data-level', 0)
        cells[INDEX] = 0
      } else {
        const LEVEL = parseInt(cell.getAttribute('data-level'), 10) || 0
        cell.setAttribute('data-level', Math.min(3, LEVEL + 1))
        cells[INDEX] = Math.min(3, LEVEL + 1)
      }
    }
  }

  const stopDrawing = (e) => {
    rendered.current = null
    erasing.current = false
    window.removeEventListener('pointermove', draw)
    window.removeEventListener('pointerup', stopDrawing)
  }

  const startDrawing = (e) => {
    // If right mouse button, go into erase mode
    if (e.button === 2) {
      e.preventDefault()
      erasing.current = true
    }
    draw(e)
    window.addEventListener('pointermove', draw)
    window.addEventListener('pointerup', stopDrawing)
  }

  return (
    <div
      onPointerDown={startDrawing}
      onContextMenu={(e) => {
        e.preventDefault()
        return false
      }}
      ref={gridRef}
      className="commit-grid">
      {cells.map((cell, index) => {
        const COLUMN = Math.floor(index / 7) + 1
        return (
          <div style={{
            '--column': COLUMN
          }} className="commit-grid__cell" data-index={index} key={index}>
          </div>
        )
      })}
    </div>
  )
}
