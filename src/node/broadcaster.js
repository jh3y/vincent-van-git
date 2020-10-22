const fs = require('fs')
const fetch = require('node-fetch')
const { DateTime } = require('luxon')
const { cd, echo, rm, which } = require('shelljs')
const { execSync } = require('child_process')
const { scrapeCommits } = require('./scrape-commits')
const { app, BrowserWindow } = require('electron')
const { download } = require('electron-dl')
const { MESSAGING_CONSTANTS } = require('../constants')

const REPO_DIR = '.repo-to-push'
const TMP_DIR = app.getPath('temp')
const APP_DIR = app.getAppPath()
const BASE_DIR = process.cwd()
const CONFIG_FILE = 'vincent-van-git.config.json'
const SHELL_FILE = 'vincent-van-git.sh'
const CONFIG_LOCATION = `${APP_DIR}${CONFIG_FILE}`
const SHELL_LOCATION = `${TMP_DIR}${SHELL_FILE}`
const REPO_LOCATION = `${TMP_DIR}${REPO_DIR}`
const TODAY = DateTime.local()

const validateConfig = async (username, repository, branch) => {
  const userRequest = await fetch(`https://github.com/${username}`)
  if (userRequest.status !== 200)
    throw Error('Vincent van Git: Github username does not exist!')
  // Check for the repository
  const repoRequest = await fetch(`https://github.com/jh3y/${repository}`)
  if (repoRequest.status !== 200)
    throw Error('Vincent van Git: Github repository does not exist!')
  // Check for the repository branch
  const branchRequest = await fetch(
    `https://github.com/jh3y/${repository}/tree/${branch}`
  )
  if (branchRequest.status !== 200)
    throw Error('Vincent van Git: Github branch does not exist!')
}
/**
 * Generate and write a shell script to a location.
 */
const generateShellScript = async (
  commits,
  username,
  repository,
  branch,
  repoPath
) => {
  console.info('COMMITS', commits)
  const START_DAY = TODAY.minus({ days: commits.length - 1 })
  const COMMIT_MULTIPLIER = await scrapeCommits(username)
  let SCRIPT = `mkdir ${repoPath}
cd ${repoPath}
git init
`
  // Loop through the commitsay matching up the dates and creating empty commits
  for (let d = 0; d < commits.length; d++) {
    // Git commit structure
    // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
    const LEVEL = commits[d]
    const NUMBER_COMMITS = LEVEL * COMMIT_MULTIPLIER
    if (NUMBER_COMMITS > 0) {
      const COMMIT_DAY = START_DAY.plus({ days: d })
      for (let c = 0; c < NUMBER_COMMITS; c++) {
        SCRIPT += `git commit --allow-empty --date "${COMMIT_DAY.toHTTP()}" -m "Vincent paints again"\n`
        // Debug the progress of a days commits.
        // console.info(`committing for date ${(c / NUMBER_COMMITS) * 100}%`)
      }
    }
  }
  SCRIPT += `git remote add origin https://github.com/${username}/${repository}.git\n`
  SCRIPT += `git push -u origin ${branch}\n`
  SCRIPT += `cd ../\n`
  SCRIPT += `rm -rf ${repoPath}\n`
  return SCRIPT
}

const downloadShellScript = async (
  commits,
  username,
  repository,
  branch,
) => {
  // Checks that things exist before proceeding
  await validateConfig(username, repository, branch)
  const IS_EMPTY = await isEmptyRepo(username, repository)
  if (!IS_EMPTY) throw Error('VVG: Repository not empty!')
  const SCRIPT = await generateShellScript(
    commits,
    username,
    repository,
    branch,
    REPO_DIR
  )
  const WIN = BrowserWindow.getFocusedWindow()
  const FILE_URL = `${process.cwd()}/vincent-van-git.sh`
  await fs.promises.writeFile(FILE_URL, SCRIPT)
  await download(WIN, `file:///${FILE_URL}`)
}

const isEmptyRepo = async (username, repository) => {
  const PAGE = await (
    await fetch(
      `https://github.com/${username}/${repository}/graphs/commit-activity`
    )
  ).text()
  return PAGE.indexOf('blankslate') !== -1
}

const paintCommitsNode = async (
  commits,
  username,
  repository,
  branch,
  event
) => {
  const IS_EMPTY = await isEmptyRepo(username, repository)
  if (!IS_EMPTY) throw Error('VVG: Repository not empty!')
  const COMMIT_MULTIPLIER = await scrapeCommits(username)
  // Grab the start day
  const START_DAY = TODAY.minus({ days: commits.length - 1 })
  // Remove the repo directory if it exists
  try {
    // Create temp repo close by, app.getPath, temp location???
    await fs.promises.access(REPO_LOCATION)
    rm('-rf', REPO_LOCATION)
  } catch (err) {
    console.info('VVG: No repo directory exists.')
  }
  // Create the repo directory
  await fs.promises.mkdir(REPO_LOCATION)
  // Initialise the git repo
  cd(REPO_LOCATION)
  execSync('git init')
  // Loop through the array matching up the dates and creating empty commits
  for (let d = 0; d < commits.length; d++) {
    // Git commit structure
    // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
    const LEVEL = commits[d]
    const NUMBER_COMMITS = LEVEL * COMMIT_MULTIPLIER
    if (NUMBER_COMMITS > 0) {
      const COMMIT_DAY = START_DAY.plus({ days: d })
      for (let c = 0; c < NUMBER_COMMITS; c++) {
        execSync(
          `git commit --allow-empty --date "${COMMIT_DAY.toHTTP()}" -m "Vincent paints again"`
        )
        // Debug the progress of a days commits.
        // console.info(`committing for date ${(c / NUMBER_COMMITS) * 100}%`)
      }
    }
    // Debug the progress of the process.
    // console.info(`processing ${(d / commits.length) * 100}%`)
  }
  // TODO: Communicate progress in the console and to the user on the front end.
  // It takes time, make an animation of pixel art at the laptop?
  console.info('All commits processed')
  // Push it up online
  execSync(
    `git remote add origin https://github.com/${username}/${repository}.git`
  )
  execSync(`git push -u origin ${branch}`)
  // Back up a directory
  cd(BASE_DIR)
  // Remove the repo
  rm('-rf', REPO_LOCATION)
}

const broadcast = async ({ username, repository, branch, commits }, event) => {
  // Validation stuff.
  try {
    // Check for git
    if (!which('git'))
      throw Error('Vincent van Git: git CLI not installed on machine!')
    // Check for user
    const userRequest = await fetch(`https://github.com/${username}`)
    if (userRequest.status !== 200)
      throw Error('Vincent van Git: Github username does not exist!')
    // Check for the repository
    const repoRequest = await fetch(`https://github.com/jh3y/${repository}`)
    if (repoRequest.status !== 200)
      throw Error('Vincent van Git: Github repository does not exist!')
    // Check for the repository branch
    const branchRequest = await fetch(
      `https://github.com/jh3y/${repository}/tree/${branch}`
    )
    if (branchRequest.status !== 200)
      throw Error('Vincent van Git: Github branch does not exist!')

    await paintCommitsNode(commits, username, repository, branch, event)

  } catch (err) {
    throw Error(err)
  }
}

module.exports = {
  broadcast,
  downloadShellScript
}
