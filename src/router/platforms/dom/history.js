import { history } from '../../integrations'

const originalPush = history.push
const originalReplace = history.replace
const originalGo = history.go
let currIdx = 0

Object.assign(history, {
  push(item) {
    item = originalPush.call(history, item)
    window.history.pushState(item, '', item.url)
  },
  replace(item) {
    item = originalReplace.call(history, item)
    window.history.replaceState(item, '', item.url)
  },
  go(to) {
    originalGo.call(history, to)
    return window.history.go(to)
  }
})

window.addEventListener('popstate', ev => {
  if (ev.state) {
    // TODO paste this here
  }
  const { idx } = ev.state
  const offset = currIdx < idx ? 1 : -1
  currIdx = idx
  originalGo.call(history, offset)
})
