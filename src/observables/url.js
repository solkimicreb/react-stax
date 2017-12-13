import { observable, observe } from '@nx-js/observer-util'
import { Queue, priorities } from '@nx-js/queue-util'
import { toQuery, toParams, toPages, toPath } from '../urlUtils'

const rawParams = toParams(location.search)
const rawPages = toPages(location.pathname)
export const params = observable(rawParams)
export const pages = observable(rawPages)
export const urlScheduler = new Queue(priorities.LOW)

function syncUrl () {
  const url = toPath(pages) + toQuery(params) + location.hash
  history.replaceState(rawParams, '', url)
}

observe(syncUrl, { scheduler: urlScheduler })
