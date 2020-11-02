const APP_CONSTANTS = {
  WIDTH: 943,
  HEIGHT: 360,
}

const MESSAGING_CONSTANTS = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  DELETE: 'VVG_DELETE',
  PUSH: 'VVG_PUSH',
  SAVE: 'VVG_SAVE',
  GENERATE: 'VVG_GENERATE',
  UPDATE: 'VVG_UPDATE',
  UPDATED: 'VVG_UPDATED',
  CONFIG: 'VVG_CONFIG',
}

const MESSAGES = {
  NO_CHANGE: 'Configuration unchanged',
  SAVED: 'Configuration saved',
  UPDATED: 'Configuration updated',
  DELETED: 'Configuration deleted',
  WIPED: 'Grid wiped',
  CONFIRM_WIPE: 'Wipe grid?',
  CONFIRM_PUSH: `Push to Github?
NOTE: For complex drawings, Vincent van Git can generate 1000s of commits.
This takes some time. Be patient.`,
  CONFIRM_DELETE: name => `Delete configuration${name ? ` ${name} ` : ''}?`,
  DOWNLOADED: 'Shell script downloaded',
  GENERATING: 'Generating shell script',
  PUSHING: 'Generating and pushing commits',
  PUSHED: 'Commits pushed',
  LOADED: 'Configuration loaded',
  CHECKING: 'Validating configuration',
  SETTINGS: 'Settings updated',
  BRANCH: 'Branch does not exist',
  USERNAME: 'Username does not exist',
  REPO: 'Repository does not exist',
  GIT: 'Git not installed',
  EMPTY: 'Repository not empty',
}

export {
  APP_CONSTANTS,
  MESSAGING_CONSTANTS,
  MESSAGES,
}