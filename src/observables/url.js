import { observable, observe } from '@nx-js/observer-util'
import { Queue, priorities } from '@nx-js/queue-util'
import { toQuery, toParams, toPathArray, toPathString } from '../urlUtils'

const rawParams = toParams(location.search)
const rawPath = toPathArray(location.pathname)
export const params = observable(rawParams)
export const path = observable(rawPath)
export const urlScheduler = new Queue(priorities.LOW)

function syncUrl () {
  const url = toPathString(path) + toQuery(params) + location.hash
  history.replaceState(rawParams, '', url)
}

observe(syncUrl, { scheduler: urlScheduler })
