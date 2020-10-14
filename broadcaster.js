const fs = require('fs')
const { DateTime } = require('luxon')
const { cd, echo, rm, which } = require('shelljs')
const { exec }  = require('child_process')

const GITHUB_USERNAME = 'jh3y'
const GITHUB_REPOSITORY = 'vincent-van-git-test'
const REPO_DIR = '.push-me'
const REPO_LOCATION = `${process.cwd()}/${REPO_DIR}`


const broadcast = async arr => {
  const TODAY = DateTime.local()
  const START_DAY = TODAY.minus({days: arr.length - 1})
  echo(TODAY)
  // console.info(arr)
  // console.info(TODAY)
  // console.info(START_DAY)
  // exec('say payload received')
  /**
   * Received a large array of either 0, 1, 2, or 3
   * 1. Set the Github username
   * 2. Set the repository
   * 3. Create a repository locally with that name
   * 4. Create empty commits with the dates that match up with the array
   * 4.5. Use Lux or something to do the Date Math for me
   * 5. Set the git remote
   * 6. Push the repository up
   *
   * To get this working. Try the steps manually minus the committing part.
   */

  // 3. Create a repository in a directory.
  if (which('git')) {
    // Remove the repo directory if it exists
    try {
      await fs.promises.access(REPO_LOCATION)
      rm('-rf', REPO_LOCATION)
    } catch (err) {
      console.info('VVG: No repo directory exists.')
    }
    // Create the repo directory
    await fs.promises.mkdir(REPO_LOCATION)
    // Initialise the git repo
    cd(REPO_LOCATION)
    exec('git init')
    exec('say new git repo initialized')
    // Loop through the array matching up the dates and creating empty commits
    for (let d = 0; d < arr.length; d++) {
      // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
      const LEVEL = arr[d]
      const NUMBER_COMMITS = LEVEL * 50
      if (NUMBER_COMMITS > 0) {
        const COMMIT_DAY = START_DAY.plus({ days: d })
        for (let c = 0; c < NUMBER_COMMITS; c++) {
          exec(`git commit --allow-empty --date "${COMMIT_DAY.toHTTP()}" -m "Vincent paints again"`)
        }
      }
    }
  }
}

module.exports = {
  broadcast
}