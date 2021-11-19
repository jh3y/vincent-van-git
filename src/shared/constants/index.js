const Mirror = (values) =>
  Object.freeze(values.reduce((keys, key) => ({ ...keys, [key]: key }), {}))

const README = `# Hello!

Thank you for trying Vincent van Git.

To paint to your GitHub contributions graph, run the \`vincent-van-git.sh\` file.

__Happy painting!__

-----

jh3y 2020 MIT

`

const TOASTS = Mirror(['INFO', 'SUCCESS', 'ERROR'])

const MESSAGING = Mirror(['DELETE', 'SAVE', 'GENERATE', 'UPDATE'])

const ACTIONS = Mirror([
  'DELETE',
  'SETTINGS',
  'AUDIO',
  'GENERATE',
  'LOAD',
  'WIPE',
  'TOASTING',
  'DISMISS',
  'IMPORT',
])

const MESSAGES = {
  NO_CHANGE: 'Configuration unchanged',
  SAVED: 'Configuration saved!',
  UPDATED: 'Configuration updated!',
  DELETED: 'Configuration deleted!',
  WIPED: 'Grid wiped!',
  CONFIRM_WIPE: 'Wipe grid?',
  HAPPY: 'Happy Painting!',
  CONFIRM_DOWNLOAD: 'Download Shell Script?',
  CONFIRM_DELETE: (name) => `Delete configuration${name ? ` ${name}` : ''}?`,
  DOWNLOADED: 'Shell script downloaded!',
  GENERATING: 'Generating shell script',
  LOADED: 'Configuration loaded!',
  CHECKING: 'Validating configuration',
  SETTINGS: 'Settings updated',
  MAX: (multi) => `Max commits in a day: ${multi}`,
  TOTAL: (total) => `Generating ${total} commits!`,
  DISCARD: (name) => `Discard unsaved changes to load ${name}?`,
  EXPORTED: 'Exported images!',
  IMPORTED: (number) => `${number} Image${number > 1 ? 's' : ''} imported!`,
  NO_IMPORT: 'Nothing to import!',
  JSON: 'Import file must be named "vincent-van-git.config.json"',
}

export const SELECT_PLACEHOLDER = 'Select Configuration'
export const INPUT_PLACEHOLDER = 'Configuration Name'

export { MESSAGING, MESSAGES, ACTIONS, README, TOASTS }
