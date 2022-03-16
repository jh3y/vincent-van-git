import React, { Fragment } from 'react'
import GitHub from '../../assets/icons/github.svg'

const GitHubLink = () => {
  return (
    <Fragment>
      <a
        href="https://github.com/jh3y/vincent-van-git"
        className="icon-button float-icon right">
        <GitHub />
      </a>
    </Fragment>
  )
}

export default GitHubLink
