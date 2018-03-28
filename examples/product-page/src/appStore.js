import { store, params } from 'react-easy-stack'
import * as api from './api'

const appStore = store({
  isLoggedIn: api.isLoggedIn(),
  isLoading: false,
  message: '',
  products: []
})

export async function search () {
  appStore.products = await api.search(params.search)
}

export async function resolveProduct () {
  if (!params.id) {
    return { product: {} }
  }
  return { product: await api.fetchProduct(params.id) }
}

export async function saveProduct (product) {
  return api.saveProduct(product)
}

export async function editProduct (id, data) {
  return api.editProduct(id, data)
}

export async function login (loginData) {
  appStore.user = await api.login(loginData)
  appStore.isLoggedIn = true
}

export function logout () {
  api.logout()
  appStore.isLoggedIn = false
}

export async function register (registerData) {
  appStore.user = await api.register(registerData)
  appStore.isLoggedIn = true
}

export function clearMessage () {
  appStore.message = ''
}

export function notify (message) {
  appStore.message = message
}

export default appStore
