import { ACTIONS, TOASTS, MESSAGES } from '../../shared/constants'
import { DateTime } from 'luxon'
import 'regenerator-runtime/runtime'

const processCommits = async (
  commits,
  multiplier,
  onCommit,
  dispatch,
  startDate,
  startOffset,
  endOffset
) => {
  // Convert startDate (Date object) to Luxon DateTime
  const START_DAY = DateTime.fromJSDate(startDate)
  let total = 0
  let genArr = []

  // Only process cells that are not offset cells
  // Skip cells before startOffset and after (commits.length - endOffset)
  const dataStartIndex = startOffset
  const dataEndIndex = commits.length - endOffset

  for (let c = dataStartIndex; c < dataEndIndex; c++) {
    const LEVEL = commits[c]
    const NUMBER_COMMITS = LEVEL * multiplier
    total += NUMBER_COMMITS
    genArr.push({ count: NUMBER_COMMITS, cellIndex: c })
  }

  // Dispatch a message.
  dispatch({
    type: ACTIONS.TOASTING,
    toast: {
      type: TOASTS.INFO,
      message: MESSAGES.TOTAL(total),
      life: 4000,
    },
  })

  // Loop through the commits matching up the dates and creating empty commits
  for (let d = 0; d < genArr.length; d++) {
    // Git commit structure
    // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
    const { count: COMMITS, cellIndex } = genArr[d]
    if (COMMITS > 0) {
      // Calculate the date: startDate + (cellIndex - startOffset) days
      // This aligns with the UI grid where cell at startOffset represents startDate
      const DAYS_FROM_START = cellIndex - startOffset
      const COMMIT_DAY = START_DAY.plus({ days: DAYS_FROM_START })
      for (let c = 0; c < COMMITS; c++) {
        onCommit(COMMIT_DAY.toISO({ includeOffset: true }))
      }
    }
  }
}

const downloadFile = async (content, name) => {
  if (window.URL.createObjectURL) {
    const FILE_URL = window.URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = FILE_URL
    link.download = name
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(FILE_URL)
    link.remove()
  } else {
    throw Error('Error downloading file')
  }
}

const generateShellScript = async (
  commits,
  username,
  multiplier,
  repository,
  branch,
  repoPath,
  dispatch,
  startDate,
  startOffset,
  endOffset
) => {
  let SCRIPT = `mkdir ${repoPath}
cd ${repoPath}
git init
`
  await processCommits(
    commits,
    multiplier,
    (date) => {
      SCRIPT += `git commit --allow-empty --date "${date}" -m "Vincent paints again"\n`
    },
    dispatch,
    startDate,
    startOffset,
    endOffset
  )
  SCRIPT += `git remote add origin https://github.com/${username}/${repository}.git\n`
  SCRIPT += `git branch -M ${branch}\n`
  SCRIPT += `git push -u origin ${branch}\n`
  SCRIPT += `cd ../\n`
  SCRIPT += `rm -rf ${repoPath}\n`
  return SCRIPT
}

export { generateShellScript, downloadFile }
