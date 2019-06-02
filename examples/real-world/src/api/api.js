import axios from 'axios'
import { storage } from 'react-stax'

const api = axios.create({
  baseURL: 'https://conduit.productionready.io/api',
  timeout: 20000
})

if (storage.token) {
  api.defaults.headers.Authorization = `Token ${storage.token}`
}

export default api
