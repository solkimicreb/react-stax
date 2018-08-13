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

// TODO: maybe this needs an emtpy object inside!
const items = []
let idx = 0
export const history = {
  createItem(item = {}) {
    if (typeof item === 'string') {
      item = toObject(item)
    }
    item = {
      // raw (non Proxied) versions must be used here
      // Proxies can not be serialized by browsers
      path: Array.from(raw(item.path)),
      params: Object.assign({}, raw(item.params)),
      session: Object.assign({}, raw(item.session)),
      // scroll config can be passed without copying as it is read-only
      scroll: item.scroll,
      url: toUrl(item)
    }
    // TODO: WHY IS THIS HERE??
    // update the params and path to reflect the new history item
    /*Object.assign(params, item.params)
    path.splice(0, Infinity, ...item.path)*/
    return item
  },
  get state() {
    return items[idx]
  },
  get length() {
    return items.length
  },
  push(item) {
    items.splice(++idx, Infinity, this.createItem(item))
  },
  replace(item) {
    items[idx] = this.createItem(item)
  },
  go(toIdx) {
    idx = Math.min(items.length - 1, Math.max(0, idx + toIdx))
    const { path, params, session } = items[idx]
    return route({
      to: toPathString(path),
      params,
      session,
      scroll: false,
      push: false
    })
  },
  back() {
    this.go(-1)
  },
  forward() {
    this.go(1)
  }
}

function syncHistory() {
  const scroll = history.state ? history.state.scroll : undefined
  history.replace({ path, params, session, scroll })
}
observe(syncHistory, { scheduler })
