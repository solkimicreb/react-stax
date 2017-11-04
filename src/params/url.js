import { toWidgetType } from './types'
import { toQuery, toParams } from './searchParams'

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
    history.replaceState(params, '', createUrl(params))
  }
}

function createUrl (params) {
  return location.pathname + toQuery(params) + location.hash
}
