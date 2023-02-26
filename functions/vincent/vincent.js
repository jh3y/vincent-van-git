const cheerio = require('cheerio')
const fetch = require('node-fetch')

const MESSAGES = {
  BRANCH: (branch, repository, username) =>
    `Branch "${branch}" does not exist for repository "${username}/${repository}"`,
  USERNAME: (username) => `Username "${username}" does not exist`,
  REPO: (username, repository) =>
    `Repository "${username}/${repository}" does not exist`,
  EMPTY: (username, repository) =>
    `Repository "${username}/${repository}" is not empty`,
}

const isEmptyRepo = async (username, repository) => {
  const PAGE = await (
    await fetch(
      `https://github.com/${username}/${repository}/graphs/commit-activity`
    )
  ).text()
  return PAGE.indexOf('blankslate') !== -1
}

const validateConfig = async (username, repository, branch) => {
  const userRequest = await fetch(`https://github.com/${username}`)
  if (userRequest.status !== 200) throw Error(MESSAGES.USERNAME(username))
  // Check for the repository
  const repoRequest = await fetch(
    `https://github.com/${username}/${repository}`
  )
  if (repoRequest.status !== 200)
    throw Error(MESSAGES.REPO(username, repository))
  // Check for the repository branch
  const branchRequest = await fetch(
    `https://github.com/${username}/${repository}/tree/${branch}`
  )
  if (branchRequest.status !== 200)
    throw Error(MESSAGES.BRANCH(branch, repository, username))
  const IS_EMPTY = await isEmptyRepo(username, repository)
  if (!IS_EMPTY) throw Error(MESSAGES.EMPTY(username, repository))
  return false
}

const getCommitMultiplier = async (username) => {
  // Grab the page HTML
  const PAGE = await (
    await fetch(`https://github.com/users/${username}/contributions`)
  ).text()
  // Use Cheerio to parse the highest commit count for a day
  const $ = cheerio.load(PAGE)
  // Instantiate an Array
  const COUNTS = []
  // Grab all the commit days from the HTML
  // const COMMIT_DAYS = $('[data-count]')
  const COMMIT_DAYS = $('.ContributionCalendar-day')
  // Loop over the commit days and grab the "data-count" attribute
  // Push it into the Array
  COMMIT_DAYS.each((DAY) => {
    const MSG = COMMIT_DAYS[DAY]?.children[0]?.data
    if (MSG) {
      const COUNT = parseInt(MSG.split(' ')[0], 10)
      if (!isNaN(COUNT)) COUNTS.push(COUNT)
    }
  })
  return Math.max(...COUNTS)
}
exports.handler = async (event, context) => {
  try {
    const { username, repository, branch } = event.queryStringParameters
    await validateConfig(username, repository, branch)
    const MAX_COMMITS = await getCommitMultiplier(username)
    // Scrape with these here to make checks.
    // Then either send back the multiplier or an Error.
    return {
      statusCode: 200,
      body: JSON.stringify({ multiplier: MAX_COMMITS }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    }
  }
}
