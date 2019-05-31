import { observable, observe, raw } from '@nx-js/observer-util'
import {
  toPathArray,
  toParams,
  toScroll,
  toUrl,
  replace,
  schedulers
} from 'utils'

export const path = observable([])
export const params = observable()
export const session = observable()

updateCurrentState({
  path: toPathArray(window.location.pathname),
  params: toParams(window.location.search),
  scroll: toScroll(window.location.hash),
  session: {}
})

export const history = {
  push(item) {
    updateCurrentState(item)
    window.history.pushState(item, '', item.url)
    return item
  },
  replace(item) {
    updateCurrentState(item)
    window.history.replaceState(item, '', item.url)
    return item
  },
  go(offset) {
    return window.history.go(offset)
  },
  forward() {
    return history.go(1)
  },
  back() {
    return history.go(-1)
  }
}

function updateCurrentState(item) {
  replace(path, item.path)
  replace(params, item.params)
  replace(session, item.session)
}

function syncHistory() {
  console.log('SYNC!!')
  const item = {
    path: Array.from(path),
    params: Object.assign({}, params),
    session: Object.assign({}, session)
  }
  const url = toUrl(item)
  window.history.replaceState(item, '', url)
}
// the URL and history can be updated with a low priority, the user won't notice
observe(syncHistory, { scheduler: schedulers.low })

window.addEventListener('popstate', ev => {
  updateCurrentState(ev.state)
})
