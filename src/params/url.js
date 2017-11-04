import { toWidgetType } from './types'
import { toQuery, toParams } from './searchParams'
import { links } from '../stores'
import { isRouting } from '../status'
import { getParams, setParams } from './params'

export default function syncUrl (config, store) {
  const params = getParams()
  let paramsChanged = false

  for (let key of config.url) {
    const newValue = toWidgetType(store[key], false)
    if (params[key] !== newValue) {
      params[key] = newValue
      paramsChanged = true
    }
  }

  // replaceState is expensive, only do it when it is necessary
  if (paramsChanged && !isRouting()) {
    history.replaceState(params, '', createUrl(params))
    links.forEach(link => link.updateActivity())
  }
}

function createUrl (params) {
  return location.pathname + toQuery(params) + location.hash
}
