import api, { auth } from './api'

export async function getMe () {
  const { data } = await api.get('/user')
  auth(data.user.token)
  return data.user
}

export async function login (user) {
  const { data } = await api.post('/users/login', { user })
  auth(data.user.token)
  return data.user
}

export async function register (user) {
  const { data } = await api.post('/users', { user })
  auth(data.user.token)
  return data.user
}

export async function update (user) {
  const { data } = await api.post('/user', { user })
  return data
}
