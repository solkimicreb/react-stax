import api from './api'

export async function getMe() {
  const { data } = await api.get('/user')
  return data
}

export async function login(user) {
  const { data } = await api.post('/users/login', { user })
  return data
}

export async function register(user) {
  const { data } = await api.post('/users', { user })
  return data
}

export async function update(user) {
  const { data } = await api.get('/user', { user })
  return data
}
