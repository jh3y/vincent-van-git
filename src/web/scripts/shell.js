import { ACTIONS, README, TOASTS } from '../../shared/constants'
import { DateTime } from 'luxon'
import zip from 'jszip'
import 'regenerator-runtime/runtime'

const processCommits = async (commits, multiplier, onCommit, dispatch) => {
  const TODAY = DateTime.local()
  const START_DAY = TODAY.minus({ days: commits.length - 1 })
  let total = 0
  let genArr = []
  for (let c = 0; c < commits.length; c++) {
    const LEVEL = commits[c]
    const NUMBER_COMMITS = LEVEL * multiplier
    total += NUMBER_COMMITS
    genArr.push(NUMBER_COMMITS)
  }
  // Dispatch a message.
  dispatch({
    type: ACTIONS.TOASTING,
    toast: {
      type: TOASTS.INFO,
      message: `Generating ${total} commits!`,
    },
  })
  // Loop through the commits matching up the dates and creating empty commits
  for (let d = 0; d < genArr.length; d++) {
    // Git commit structure
    // git commit --allow-empty --date "Mon Oct 12 23:17:02 2020 +0100" -m "Vincent paints again"
    const COMMITS = genArr[d]
    if (COMMITS > 0) {
      const COMMIT_DAY = START_DAY.plus({ days: d })
      for (let c = 0; c < COMMITS; c++) {
        onCommit(COMMIT_DAY.toISO({ includeOffset: true }))
      }
    }
  }
}

const downloadFile = async (content) => {
  if (window.URL.createObjectURL) {
    const FILE = new zip()
    FILE.file('vincent-van-git.sh', content)
    FILE.file('README.md', README)
    const ZIP_FILE = await FILE.generateAsync({ type: 'blob' })
    const FILE_URL = window.URL.createObjectURL(ZIP_FILE)
    const link = document.createElement('a')
    link.href = FILE_URL
    link.download = 'vincent.zip'
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
  dispatch
) => {
  let SCRIPT = `mkdir ${repoPath}
cd ${repoPath}
git init
`
  await processCommits(
    commits,
    multiplier,
    (date) => {
      SCRIPT += `git commit --allow-empty --date "${date})}" -m "Vincent paints again"\n`
    },
    dispatch
  )
  SCRIPT += `git remote add origin https://github.com/${username}/${repository}.git\n`
  SCRIPT += `git push -u origin ${branch}\n`
  SCRIPT += `cd ../\n`
  SCRIPT += `rm -rf ${repoPath}\n`
  return SCRIPT
}

export { generateShellScript, downloadFile }
