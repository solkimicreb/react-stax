import { toWidgetType } from './types'
import { toQuery, toParams } from './searchParams'
import { links } from '../stores'
import { isRouting } from '../status'

export let params = toParams(location.search)
history.replaceState(params, '', createUrl(params))

export function setParams (newParams) {
  params = newParams
}

export function syncUrl (config, store) {
  let paramsChanged = false

  for (let key of config.url) {
    if (params[key] !== store[key]) {
      params[key] = store[key]
      paramsChanged = true
    }
  }

  // replaceState is expensive, only do it when it is necessary
  if (paramsChanged && !isRouting()) {
    // use pushState here if it is a history param
    history.replaceState(params, '', createUrl(params))
    links.forEach(link => link.updateActivity())
  }
}

function createUrl (params) {
  return location.pathname + toQuery(params) + location.hash
}
