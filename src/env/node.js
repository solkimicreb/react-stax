import { Queue, priorities } from '@nx-js/queue-util'

export default typeof global === 'object' && typeof global.process === 'object'

// replace this with a sync scheduler later!! (implement it)
export const scheduler = new Queue(priorities.LOW)

const noop = () => null

export const localStorage = {
  getItem: noop,
  setItem: noop
}

function updateUrl (state, title, url) {
  let tokens = url.split('?')
  location.pathname = tokens[0]
  location.search = tokens[1] ? `?${tokens[1]}` : ''
  tokens = location.search.split('#')
  location.hash = tokens[1] ? `#${tokens[1]}` : ''
}

export const history = {
  replaceState: updateUrl,
  pushState: updateUrl
}

export const location = {
  pathname: '',
  search: '',
  hash: ''
}

export const historyHandler = noop
