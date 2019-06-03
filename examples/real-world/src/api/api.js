import axios from 'axios'
import { storage } from 'react-stax'

const api = axios.create({
  baseURL: 'https://conduit.productionready.io/api',
  timeout: 20000
})

if (storage.token) {
  auth(storage.token)
}

export function auth(token) {
  api.defaults.headers.Authorization = `Token ${token}`
  storage.token = token
}

export default api
