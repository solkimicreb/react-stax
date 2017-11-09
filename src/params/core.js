import { easyStore as originalEasyStore } from 'react-easy-state'
import { observe, priorities } from '@nx-js/observer-util'
import syncUrl from './url'
import { syncStorage } from './storage'
import setupConfig from './setupConfig'
import { toParams } from './searchParams'
import { setParams } from './params'

export function easyStore (store, config) {
  store = originalEasyStore(store)

  if (config === undefined) {
    return store
  }
  if (typeof config !== 'object' || config === null) {
    throw new TypeError(
      'The second argument must be undefined or a config object.'
    )
  }

  config = setupConfig(config)

  observe(() => syncUrl(config, store))
  observe(() => syncStorage(config, store))

  return store
}

// init the state with the URL search params
const params = toParams(location.search)
setParams(params)
history.replaceState(params, '')
