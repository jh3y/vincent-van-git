import { useEffect, useReducer } from 'react'
import { MESSAGES, ACTIONS, TOASTS } from '../../shared/constants'

const APP_NAME = 'vincent-van-git'
const DEFAULT_STATE = {
  muted: false,
  images: [],
  username: null,
  repository: null,
  branch: null,
  toast: null,
  generating: false,
  selected: '',
}

const INITIAL_STATE = window.localStorage.getItem(APP_NAME)
  ? JSON.parse(window.localStorage.getItem(APP_NAME))
  : DEFAULT_STATE

const usePersistentReducer = (
  reducer,
  initialState = INITIAL_STATE,
  blacklist = []
) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const persisted = Object.keys(state).reduce((obj, key) => {
      if (blacklist.indexOf(key) === -1) obj[key] = state[key]
      return obj
    }, {})
    window.localStorage.setItem(APP_NAME, JSON.stringify(persisted))
  }, [state, blacklist])
  return [state, dispatch]
}

// Generate initial state based off of localStorage
// TODO: Hook this up to localStorage
const APP_REDUCER = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.AUDIO:
      return {
        ...state,
        muted: !state.muted,
        toast: {
          type: TOASTS.INFO,
          message: `Audio ${!state.muted ? 'off' : 'on'}`,
        },
      }
    case ACTIONS.SAVE: {
      // Need to check if it exists by name or value.
      const EXISTS_BY_NAME =
        state.images.filter((image) => image.name === action.name).length > 0
      const EXISTS_BY_VALUE =
        state.images.filter(
          (image) => image.commits === JSON.stringify(action.commits)
        ).length > 0
      // If it does, update or do nothing.
      if (EXISTS_BY_VALUE && EXISTS_BY_NAME) {
        return {
          ...state,
          toast: {
            type: TOASTS.INFO,
            message: MESSAGES.NO_CHANGE,
          },
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
        }
      } else if (EXISTS_BY_VALUE) {
        // Changing the name
        return {
          ...state,
          images: state.images.map((image) => ({
            name:
              image.commits === JSON.stringify(action.commits)
                ? action.name
                : image.name,
            commits: image.commits,
          })),
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
          toast: {
            type: TOASTS.SUCCESS,
            message: MESSAGES.UPDATED,
          },
        }
      } else if (EXISTS_BY_NAME) {
        return {
          ...state,
          images: state.images.map((image) => ({
            name: image.name,
            commits:
              image.name === action.name
                ? JSON.stringify(action.commits)
                : image.commits,
          })),
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
          toast: {
            type: TOASTS.SUCCESS,
            message: MESSAGES.UPDATED,
          },
        }
      } else {
        return {
          ...state,
          images: [
            ...state.images,
            {
              commits: JSON.stringify(action.commits),
              name: action.name,
            },
          ],
          selected: JSON.stringify({
            name: action.name,
            commits: JSON.stringify(action.commits),
          }),
          toast: {
            type: TOASTS.SUCCESS,
            message: MESSAGES.SAVED,
          },
        }
      }
    }
    case ACTIONS.TOASTING:
      return {
        ...state,
        toast: action.toast,
      }
    case ACTIONS.DELETE:
      return {
        ...state,
        images: state.images.filter((image) => image.name !== action.name),
        selected: '',
        toast: {
          type: TOASTS.SUCCESS,
          message: MESSAGES.DELETED,
        },
      }
    case ACTIONS.GENERATE:
      return {
        ...state,
        generating: !state.generating,
        ...(!action.silent && {
          toast: {
            type: TOASTS.INFO,
            message: !state.generating
              ? MESSAGES.GENERATING
              : MESSAGES.DOWNLOADED,
          },
        }),
      }
    case ACTIONS.LOAD:
      return {
        ...state,
        selected: action.selected,
        cleared: new Date().toUTCString(),
        ...(action.selected !== '' && {
          toast: {
            type: TOASTS.INFO,
            message: MESSAGES.LOADED,
          },
        }),
      }
    case ACTIONS.WIPE:
      return {
        ...state,
        cleared: new Date().toUTCString(),
        selected: '',
        toast: {
          type: TOASTS.INFO,
          message: MESSAGES.WIPED,
        },
      }
    case ACTIONS.SETTINGS:
      return {
        ...state,
        toast: {
          type: TOASTS.INFO,
          message: MESSAGES.SETTINGS,
        },
        username: action.username,
        repository: action.repository,
        branch: action.branch,
      }
    default:
      return state
  }
}

export { usePersistentReducer, APP_REDUCER }
