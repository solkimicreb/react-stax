import { history } from '../../integrations'
import { route } from '../../core'

Object.defineProperties(history, {
  state: {
    get: () => window.history.state
  },
  length: {
    get: () => window.history.length
  }
})

Object.assign(history, {
  push(item) {
    item = history.createItem(item)
    window.history.pushState(item, '', item.url)
  },
  replace(item) {
    item = history.createItem(item)
    window.history.replaceState(item, '', item.url)
  },
  go(to) {
    return window.history.go(to)
  },
  forward() {
    return window.history.forward()
  },
  back() {
    return window.history.back()
  }
})

window.addEventListener('popstate', ev => {
  const { path, params, session } = ev.state
  return route({
    to: path,
    params,
    session,
    scroll: false,
    push: false
  })
})
