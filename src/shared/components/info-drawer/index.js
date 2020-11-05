import T from 'prop-types'
import React, { Fragment } from 'react'
import Information from '../../assets/icons/information-outline.svg'

import Drawer from '../drawer'
const InfoDrawer = ({ footer: Footer }) => {
  return (
    <Drawer title="Instructions" icon={Information} left={false}>
      <Fragment>
        <section>
          <ul>
            <li>
              Set the Github username, repository, and branch in settings.
            </li>
            <li>Left pointer to draw, right pointer to erase.</li>
            <li>Ensure the repository is an empty repository.</li>
            <li>
              Don&apos;t run if you already have a drawing on your graph. This
              will trigger a huge amount of commits.
            </li>
          </ul>
        </section>
        {Footer && <Footer />}
      </Fragment>
    </Drawer>
  )
}

InfoDrawer.propTypes = {
  footer: T.func,
}

export default InfoDrawer
