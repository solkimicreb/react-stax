import { toWidgetType } from './types'
import { toQuery, toParams } from './searchParams'
import { links } from '../stores'
import { isRouting } from '../status'

export default function syncUrl (config, store) {
  const params = history.state
  let paramsChanged = false

  for (let key of config.url) {
    const newValue = toWidgetType(store[key], false)
    if (params[key] !== newValue) {
      params[key] = newValue
      paramsChanged = true
    }
  }

  // replaceState is expensive, only do it when it is necessary
  if (paramsChanged) {
    if (isRouting()) {
      history.replaceState(params, '')
    } else {
      // only replace the url and update the links if I am not routing
      history.replaceState(params, '', createUrl(params))
      links.forEach(link => link.updateActivity())
    }
  }
}

function createUrl (params) {
  return location.pathname + toQuery(params) + location.hash
}
