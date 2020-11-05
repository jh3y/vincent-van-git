const cheerio = require('cheerio')
const fetch = require('node-fetch')

const MESSAGES = {
  BRANCH: 'Branch does not exist',
  USERNAME: 'Username does not exist',
  REPO: 'Repository does not exist',
  EMPTY: 'Repository not empty',
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
  if (userRequest.status !== 200) throw Error(MESSAGES.USERNAME)
  // Check for the repository
  const repoRequest = await fetch(`https://github.com/jh3y/${repository}`)
  if (repoRequest.status !== 200) throw Error(MESSAGES.REPO)
  // Check for the repository branch
  const branchRequest = await fetch(
    `https://github.com/jh3y/${repository}/tree/${branch}`
  )
  if (branchRequest.status !== 200) throw Error(MESSAGES.BRANCH)
  const IS_EMPTY = await isEmptyRepo(username, repository)
  if (!IS_EMPTY) throw Error(MESSAGES.EMPTY)
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
  const COMMIT_DAYS = $('[data-count]')
  // Loop over the commit days and grab the "data-count" attribute
  // Push it into the Array
  COMMIT_DAYS.each((DAY) => {
    COUNTS.push(parseInt(COMMIT_DAYS[DAY].attribs['data-count'], 10))
  })
  // console.info(`Largest amount of commits for a day is ${Math.max(...COUNTS)}`)
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
