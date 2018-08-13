import { history } from '../../integrations'

const originalPush = history.push
const originalReplace = history.replace
const originalGo = history.go

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
  const offset = history.current.idx < ev.state.idx ? 1 : -1
  originalGo.call(history, offset)
})
