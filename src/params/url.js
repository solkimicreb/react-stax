import { toWidgetType } from './types'
import { toQuery, toParams } from './searchParams'
import { links } from '../stores'
import { isRouting } from '../status'
import { getParams, setParams } from './params'

export default function syncUrl (config, store, initing) {
  const params = getParams()
  let paramsChanged = false

  for (let key of config.url) {
    if (params[key] !== store[key]) {
      params[key] = store[key]
      paramsChanged = true
    }
  }

  // replaceState is expensive, only do it when it is necessary
  if (paramsChanged && !initing && !isRouting()) {
    // use pushState here if it is a history param
    history.replaceState(params, '', createUrl(params))
    links.forEach(link => link.updateActivity())
  }
}

function createUrl (params) {
  return location.pathname + toQuery(params) + location.hash
}
