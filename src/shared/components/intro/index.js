import T from 'prop-types'
import React from 'react'
import Close from '../../assets/icons/close.svg'
import Logo from '../../assets/icons/logo64.png'
import './intro.styl'

const Intro = ({ onDismiss }) => {
  return (
    <div className="intro__backdrop" aria-hidden="true">
      <div
        className="intro"
        role="dialog"
        aria-labelledby="introTitle"
        aria-describedby="introDesc">
        <img className="intro__image" src={Logo} alt="Vincent van Git" />
        <h2 id="introTitle">Howdy!</h2>
        <div id="introDesc">
          Thank you for checking out &quot;Vincent van Git&quot;.
          <p>How to use it:</p>
          <ol>
            <li>
              Enter your Github username, repository, and branch in the
              &quot;Settings&quot; panel (Top left). Make sure the repository is
              empty. The branch should be set to what you use locally. For
              example, `main`.
            </li>
            <li>
              Draw your image! Left mouse to draw, right mouse to erase. Drawing
              over a cell again will make it darker. A cell can be one of four
              shades of green.
            </li>
            <li>
              Generate your shell script! Hit the download icon. This will
              download a zip file containing a shell script to run.
            </li>
            <li>Run the shell script.</li>
            <li>
              Once complete, check the repository to make sure the commits have
              been pushed.
            </li>
            <li>After a few minutes the image will appear on your profile!</li>
          </ol>
        </div>
        <button
          className="intro__close icon-button"
          onClick={onDismiss}
          title="Dismiss">
          <Close />
        </button>
        <button className="submit-button" onClick={onDismiss}>
          Get painting!
        </button>
      </div>
    </div>
  )
}

Intro.propTypes = {
  onDismiss: T.func,
}

export default Intro
