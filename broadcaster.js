const fs = require('fs')
const { DateTime } = require('luxon')
const { cd, echo, rm, which } = require('shelljs')
const { execSync } = require('child_process')
const { BrowserWindow } = require('electron')
const { download } = require('electron-dl')

const GITHUB_USERNAME = 'jh3y'
const GITHUB_BRANCH = 'main'
const GITHUB_REPOSITORY = 'vincent-van-git-test'
const REPO_DIR = '.push-me'
const BASE_DIR = process.cwd()
const REPO_LOCATION = `${BASE_DIR}/${REPO_DIR}`
const TODAY = DateTime.local()

/**
 * Generate and write a shell script to a location.
 *
 */
const generateShellScript = async (arr) => {
  const START_DAY = TODAY.minus({ days: arr.length - 1 })
  let SCRIPT = `mkdir .push-me
cd .push-me
git init
`
  // Loop through the array matching up the dates and creating empty commits
  for (let d = 0; d < arr.length; d++) {
    // Git commit structure
    // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
    const LEVEL = arr[d]
    const NUMBER_COMMITS = LEVEL * 50
    if (NUMBER_COMMITS > 0) {
      const COMMIT_DAY = START_DAY.plus({ days: d })
      for (let c = 0; c < NUMBER_COMMITS; c++) {
        SCRIPT += `git commit --allow-empty --date "${COMMIT_DAY.toHTTP()}" -m "Vincent paints again"\n`
        // Debug the progress of a days commits.
        // console.info(`committing for date ${(c / NUMBER_COMMITS) * 100}%`)
      }
    }
  }
  SCRIPT += `git remote add origin https://github.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}.git\n`
  SCRIPT += `git push -u origin ${GITHUB_BRANCH}\n`
  SCRIPT += `cd ../\n`
  SCRIPT += `rm -rf ${REPO_LOCATION}\n`
  return SCRIPT
}

const broadcast = async (arr, event) => {
  // Before we do anything, disable the front end.
  event.reply('vvg-progress', {
    progress: 0,
  })

  const SCRIPT = await generateShellScript(arr)
  const WIN = BrowserWindow.getFocusedWindow()
  const FILE_URL = `${process.cwd()}/vincent-van-git.sh`
  await fs.promises.writeFile(FILE_URL, SCRIPT)
  await download(WIN, `file:///${FILE_URL}`)

  event.reply('vvg-progress', {
    progress: 100,
  })
  // Grab the start day
  // const START_DAY = TODAY.minus({ days: arr.length - 1 })

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
  // if (which('git')) {
  //   // Remove the repo directory if it exists
  //   try {
  //     await fs.promises.access(REPO_LOCATION)
  //     rm('-rf', REPO_LOCATION)
  //   } catch (err) {
  //     console.info('VVG: No repo directory exists.')
  //   }
  //   // Create the repo directory
  //   await fs.promises.mkdir(REPO_LOCATION)
  //   // Initialise the git repo
  //   cd(REPO_LOCATION)
  //   execSync('git init')
  //   // Loop through the array matching up the dates and creating empty commits
  //   for (let d = 0; d < arr.length; d++) {
  //     // Git commit structure
  //     // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
  //     const LEVEL = arr[d]
  //     const NUMBER_COMMITS = LEVEL * 50
  //     if (NUMBER_COMMITS > 0) {
  //       const COMMIT_DAY = START_DAY.plus({ days: d })
  //       for (let c = 0; c < NUMBER_COMMITS; c++) {
  //         execSync(
  //           `git commit --allow-empty --date "${COMMIT_DAY.toHTTP()}" -m "Vincent paints again"`
  //         )
  //         // Debug the progress of a days commits.
  //         // console.info(`committing for date ${(c / NUMBER_COMMITS) * 100}%`)
  //       }
  //     }
  //     // Debug the progress of the process.
  //     // console.info(`processing ${(d / arr.length) * 100}%`)
  //   }
  //   // TODO: Communicate progress in the console and to the user on the front end.
  //   // It takes time, make an animation of pixel art at the laptop?
  //   console.info('All commits processed')
  //   // Push it up online
  //   execSync(
  //     `git remote add origin https://github.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}.git`
  //   )
  //   execSync(`git push -u origin ${GITHUB_BRANCH}`)
  //   // Back up a directory
  //   cd(BASE_DIR)
  //   // Remove the repo
  //   rm('-rf', REPO_LOCATION)
  // event.reply('vvg-progress', {
  //   progress: 100,
  // })
  // }
}

module.exports = {
  broadcast,
}
