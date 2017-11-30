import { observe, observable } from '@nx-js/observer-util'
import { notEmpty } from './urlUtils'

const rawPages = location.pathname.split('/')
export const pages = observable(rawPages)

export function setPages (newPages) {
  console.log('set', newPages)
  newPages = newPages.filter(notEmpty)
  pages.splice(0, 0)
  pages.length = 0
  console.log('inter', Array.from(pages))
  pages.push(...newPages)
  console.log('result', Array.from(pages))
}

function syncPages () {
  const url = pages.filter(notEmpty).join('/') + location.search + location.hash
  console.log('sync', url)
  history.replaceState(history.state, '', url)
}
observe(syncPages)
