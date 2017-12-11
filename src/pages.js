import { observe, observable } from '@nx-js/observer-util'
import { notEmpty } from './urlUtils'
import { paramsScheduler } from './params'

const rawPages = location.pathname.split('/')
export const pages = observable(rawPages)

export function setPages (newPages) {
  newPages = newPages.filter(notEmpty)
  pages.splice(0, 0)
  pages.length = 0
  pages.push(...newPages)
}

function syncPages () {
  const url = pages.filter(notEmpty).join('/') + location.search + location.hash
  history.replaceState(history.state, '', url)
}
observe(syncPages, { scheduler: paramsScheduler })
