import { observable, observe, raw } from '@nx-js/observer-util'
import { toPathString, toUrl, toObject } from './utils'
import { route } from './core'
import { integrations as scheduler } from '../schedulers'

export const elements = {
  anchor: 'a',
  div: 'div'
}

export const scroller = {
  scrollTo() {}
}

export const animation = {
  setup() {},
  enter() {},
  leave() {}
}

export const storage = observable()
export const params = observable()
export const session = observable()
export const path = observable([])

export const history = [{}]
let idx = 0

function createHistoryItem(item = {}) {
  item = {
    // raw (non Proxied) versions must be used here
    // Proxies can not be serialized by browsers
    path: Array.from(raw(item.path)),
    params: Object.assign({}, raw(item.params)),
    session: Object.assign({}, raw(item.session)),
    // scroll config can be passed without copying as it is read-only
    scroll: item.scroll,
    url: toUrl(item),
    idx
  }
  return item
}

Object.defineProperties(history, {
  current: {
    get: () => history[idx]
  }
})

Object.assign(history, {
  push(item) {
    item = createHistoryItem(item)
    history.splice(++idx, Infinity, item)
    return item
  },
  replace(item) {
    item = createHistoryItem(item)
    history[idx] = item
    return item
  },
  go(offset) {
    idx = Math.min(history.length - 1, Math.max(0, idx + offset))
    const { path, params, session } = history[idx]
    console.log(history.length - 1, idx + offset)
    console.log('go', idx, path, params, session)
    return route({
      to: toPathString(path),
      params,
      session,
      scroll: false,
      push: false
    })
  }
})

function syncHistory() {
  history.replace({ path, params, session, scroll: history.current.scroll })
}
observe(syncHistory, { scheduler })
