// const { DateTime } = require('luxon')
// const processCommits = async (onCommit, commits, username) => {
//   const TODAY = DateTime.local()
//   const START_DAY = TODAY.minus({ days: commits.length - 1 })
//   // const COMMIT_MULTIPLIER = await scrapeCommits(username)
//   const COMMIT_MULTIPLIER = 50
//   let total = 0
//   let genArr = []
//   for (let c = 0; c < commits.length; c++) {
//     const LEVEL = commits[c]
//     const NUMBER_COMMITS = LEVEL * COMMIT_MULTIPLIER
//     total += NUMBER_COMMITS
//     genArr.push(NUMBER_COMMITS)
//   }
//   // Loop through the commits matching up the dates and creating empty commits
//   for (let d = 0; d < genArr.length; d++) {
//     // Git commit structure
//     // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
//     const COMMITS = genArr[d]
//     if (COMMITS > 0) {
//       const COMMIT_DAY = START_DAY.plus({ days: d })
//       for (let c = 0; c < COMMITS; c++) {
//         onCommit(COMMIT_DAY.toISO({includeOffset: true}))
//       }
//     }
//   }
// }

// /**
//  * Generate and write a shell script to a location.
//  */
// const generateShellScript = async (
//   commits,
//   username,
//   repository,
//   branch,
//   repoPath,
// ) => {
//   let SCRIPT = `mkdir ${repoPath}
// cd ${repoPath}
// git init
// `
//   await processCommits(date => {
//     SCRIPT += `git commit --allow-empty --date "${date})}" -m "Vincent paints again"\n`
//   }, commits, username)
//   SCRIPT += `git remote add origin https://github.com/${username}/${repository}.git\n`
//   SCRIPT += `git push -u origin ${branch}\n`
//   SCRIPT += `cd ../\n`
//   SCRIPT += `rm -rf ${repoPath}\n`
//   return SCRIPT
// }


// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello World!` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
