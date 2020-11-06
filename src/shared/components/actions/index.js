import T from 'prop-types'
import React, { useEffect, useState } from 'react'
import Save from '../../assets/icons/content-save.svg'
import Delete from '../../assets/icons/delete.svg'
import Import from '../../assets/icons/import.svg'
import Export from '../../assets/icons/export.svg'
import Download from '../../assets/icons/download.svg'
import Erase from '../../assets/icons/eraser-variant.svg'
import Rocket from '../../assets/icons/rocket.svg'
import {
  SELECT_PLACEHOLDER,
  INPUT_PLACEHOLDER,
  MESSAGES,
} from '../../constants'
import './actions.styl'

const Actions = ({
  disabled,
  generating,
  dirty,
  onPush,
  onGenerate,
  onWipe,
  onSelect,
  onSave,
  onDelete,
  images,
  selectedImage,
  nameRef,
  cellsRef,
  onImport,
  onExport,
}) => {
  const [name, setName] = useState(
    selectedImage.trim() === '' ? '' : JSON.parse(selectedImage).name
  )
  const [selected, setSelected] = useState(selectedImage)

  const onChange = (e) => {
    if (
      (dirty && selectedImage === '') || // That would be wiping a new creation to load one
      (selectedImage !== '' &&
        JSON.parse(selectedImage).commits !== JSON.stringify(cellsRef.current))
    ) {
      if (window.confirm(MESSAGES.DISCARD(JSON.parse(e.target.value).name))) {
        setSelected(e.target.value)
        if (onSelect) onSelect(e)
      }
    } else {
      setSelected(e.target.value)
      if (onSelect) onSelect(e)
    }
  }

  useEffect(() => {
    setSelected(selectedImage)
    setName(selectedImage === '' ? '' : JSON.parse(selectedImage).name)
  }, [selectedImage])
  return (
    <div className="actions-container">
      {onPush && (
        <button
          disabled={disabled}
          className="icon-button"
          onClick={onPush}
          title="Push Image">
          <Rocket />
        </button>
      )}
      {onGenerate && (
        <button
          disabled={disabled}
          className="icon-button"
          onClick={onGenerate}
          title="Download Shell Script">
          <Download />
        </button>
      )}
      {onWipe && (
        <button
          disabled={!dirty}
          className="icon-button"
          onClick={onWipe}
          title="Wipe Grid">
          <Erase />
        </button>
      )}
      <div className="io-container">
        <button
          disabled={generating}
          className="icon-button"
          title="Import"
          onClick={onImport}>
          <Import />
        </button>
        <button
          disabled={generating || !images || (images && images.length === 0)}
          className="icon-button"
          title="Import"
          onClick={onExport}>
          <Export />
        </button>
      </div>
      {images && images.length > 0 && (
        <div className="select-wrapper">
          <select disabled={generating} onChange={onChange} value={selected}>
            <option>{SELECT_PLACEHOLDER}</option>
            {images.map(({ name, commits }, index) => (
              <option
                value={JSON.stringify({
                  name,
                  commits,
                })}
                key={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div
        className="configuration-container"
        style={{
          '--scale': dirty ? 1 : 0,
          visibility: dirty ? 'visible' : 'hidden',
        }}>
        <input
          type="text"
          ref={nameRef}
          disabled={!dirty || generating}
          placeholder={INPUT_PLACEHOLDER}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          disabled={name.trim() === '' || generating}
          className="icon-button"
          onClick={onSave}
          title="Save image configuration">
          <Save />
        </button>
        {selected !== '' && (
          <button
            disabled={generating || !selected}
            className="icon-button"
            onClick={onDelete}
            title="Delete Image Configuration">
            <Delete />
          </button>
        )}
      </div>
    </div>
  )
}

Actions.defaultProps = {
  selectedImage: '',
  onGenerate: () => {},
  onWipe: () => {},
}

Actions.propTypes = {
  disabled: T.bool,
  generating: T.bool,
  dirty: T.bool,
  onPush: T.func,
  onGenerate: T.func,
  onWipe: T.func,
  onSelect: T.func,
  onSave: T.func,
  onUpdate: T.func,
  onDelete: T.func,
  onImport: T.func,
  onExport: T.func,
  imageName: T.string,
  images: T.array,
  selectedImage: T.string, // Stringified Object!
  nameRef: T.oneOfType([
    // Either a function
    T.func,
    // Or the instance of a DOM native element (see the note about SSR)
    T.shape({ current: T.instanceOf(Element) }),
  ]),
  cellsRef: T.oneOfType([
    // Either a function
    T.func,
    // Or the instance of a DOM native element (see the note about SSR)
    T.shape({ current: T.array }),
  ]),
}

export default Actions
