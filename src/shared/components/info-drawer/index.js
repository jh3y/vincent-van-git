import T from 'prop-types'
import React, { Fragment } from 'react'
import Information from '../../assets/icons/information-outline.svg'
import Logo from '../../assets/icons/logo64.png'

import Drawer from '../drawer'
const InfoDrawer = ({ footer: Footer, muted }) => {
  return (
    <Drawer title="Instructions" icon={Information} left={false} muted={muted}>
      <Fragment>
        <section className="instructions-content">
          <ul>
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
          </ul>
          <hr />
          <img src={Logo} alt="Vincent van Git" />
          <p>
            Built by <a href="https://twitter.com/jh3yy">jh3yy</a>. &copy; 2020
            MIT.
          </p>
        </section>
        {Footer && <Footer />}
      </Fragment>
    </Drawer>
  )
}

InfoDrawer.propTypes = {
  footer: T.func,
  muted: T.bool,
}

export default InfoDrawer
