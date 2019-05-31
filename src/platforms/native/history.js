import { observable, observe, raw } from '@nx-js/observer-util'
import { replace, toPathString, schedulers } from 'utils'

export const path = observable([])
export const params = observable()
export const session = observable()

const historyItems = [{}]
let idx = 0

function createHistoryItem(item = {}) {
  return {
    // raw (non Proxied) versions must be used here
    // Proxies can not be serialized by browsers
    path: [...raw(item.path)],
    params: { ...raw(item.params) },
    session: { ...raw(item.session) },
    // scroll config can be passed without copying as it is read-only
    scroll: item.scroll,
    url: toUrl(item),
    idx
  }
}

// TODO: this must be batched! (for the scheduler)
function updateCurrent(item) {
  replace(path, item.path)
  replace(params, item.params)
  replace(session, item.session)
}

export const history = {
  push(item) {
    item = createHistoryItem(item)
    historyItems.splice(++idx, Infinity, item)
    updateCurrent(item)
    return item
  },
  replace(item) {
    item = createHistoryItem(item)
    historyItems[idx] = item
    updateCurrent(item)
    return item
  },
  go(offset) {
    idx = Math.min(historyItems.length - 1, Math.max(0, idx + offset))
    const { path, params, session } = historyItems[idx]
    return route({
      to: toPathString(path),
      params,
      session,
      scroll: false,
      push: false
    })
  },
  get(offset) {
    const getIdx = Math.min(historyItems.length - 1, Math.max(0, idx + offset))
    return historyItems[getIdx]
  }
}

function syncHistory() {
  history.replace({ path, params, session, scroll: historyItems[idx].scroll })
}
// the URL and history can be updated with a low priority, the user won't notice
observe(syncHistory, { scheduler: schedulers.low })
