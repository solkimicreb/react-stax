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
  go(offset) {
    originalGo.call(history, offset)
    return window.history.go(offset)
  }
})

window.addEventListener('popstate', ev => {
  const offset = history.current.idx < ev.state.idx ? 1 : -1
  originalGo.call(history, offset)
})
