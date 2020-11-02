import React from 'react'
import Save from '../../assets/icons/content-save.svg'
import Delete from '../../assets/icons/delete.svg'
import Download from '../../assets/icons/download.svg'
import Erase from '../../assets/icons/eraser-variant.svg'
import Rocket from '../../assets/icons/rocket.svg'
import './actions.styl'
// Currently what === disabled
// !dirty ||
// !config.username ||
// !config.repository ||
// !config.branch ||
// coding ||
// uploading ||
// submitted
// Consider unconfigured for wipe grid???
// Select should work when !dirty

// onPush === Github Push (Deprecating???)
// onGenerate === Shell Script generation (Shell icon?)
// onWipe === Clear grid
// images === Config images
// muted === Whether sound should play on click
// onSelect === Select image
// onChange === Updating the current image name
// onDelete === Deleting the current image
// onSave === Saving the current image
const SELECT_PLACEHOLDER = 'Select Configuration'
const INPUT_PLACEHOLDER = 'Configuration Name'
const Actions = ({
  disabled,
  dirty,
  onPush,
  onGenerate,
  onWipe,
  onSelect,
  onSave,
  onUpdate,
  onDelete,
  image,
  images,
  muted,
}) => {
  return (
    <div className="actions-container">
      <button
        disabled={disabled}
        className="icon-button"
        onClick={onPush}
        title="Push Image">
        <Rocket />
      </button>
      <button
        disabled={disabled}
        className="icon-button"
        onClick={onGenerate}
        title="Download Shell Script">
        <Download />
      </button>
      <button
        disabled={disabled}
        className="icon-button"
        onClick={onWipe}
        title="Wipe Grid">
        <Erase />
      </button>
      {images && images.length > 0 && (
        <div className="select-wrapper">
          <select
            disabled={disabled}
            onChange={onSelect}
            value={image}>
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
          disabled={disabled}
          placeholder={INPUT_PLACEHOLDER}
          onChange={onUpdate}
          value={image}
        />
        <button
          disabled={disabled}
          className="icon-button"
          onClick={onSave}
          title="Save image configuration">
          <Save />
        </button>
        {image !== '' && (
          <button
            disabled={disabled}
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

export default Actions
