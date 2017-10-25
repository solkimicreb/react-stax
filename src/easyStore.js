import { easyStore } from 'react-easy-params'
import { appStores } from './stores'

export default function wrappedEasyStore (store, params) {
  store = easyStore(store, params)
  if (params) {
    appStores.add(store)
  }
  return store
}
