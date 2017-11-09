import { observable, observe, exec } from '@nx-js/observer-util'
import { toQuery, toParams } from './searchParams'
import { links } from '../stores'
import { isRouting } from '../status'

const rawParams = toParams(location.search)
export const params = observable(rawParams)

export function setParams (newParams) {
  for (let param of Object.keys(rawParams)) {
    delete rawParams[param]
  }
  Object.assign(rawParams, newParams)
  // this could also work if the user is not caching the obj!
  // rawParams = newParams
  // params = observable(newParams)
  exec(syncParams)
}

function syncParams () {
  const url = location.pathname + toQuery(params) + location.hash
  history.replaceState(rawParams, '', url)
}

observe(syncParams)
