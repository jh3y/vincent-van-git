const cheerio = require('cheerio')
const fetch = require('node-fetch')

const scrapeCommits = async username => {
  // Grab the page HTML
  const PAGE = await (await fetch(`https://github.com/users/${username}/contributions`)).text()
  // Use Cheerio to parse the highest commit count for a day
  const $ = cheerio.load(PAGE)
  // Instantiate an Array
  const COUNTS = []
  // Grab all the commit days from the HTML
  const COMMIT_DAYS = $('[data-count]')
  // Loop over the commit days and grab the "data-count" attribute
  // Push it into the Array
  COMMIT_DAYS.each(DAY => {
    COUNTS.push(parseInt(COMMIT_DAYS[DAY].attribs['data-count'], 10))
  })
  // console.info(`Largest amount of commits for a day is ${Math.max(...COUNTS)}`)
  return Math.max(...COUNTS)
}

module.exports = {
  scrapeCommits
}