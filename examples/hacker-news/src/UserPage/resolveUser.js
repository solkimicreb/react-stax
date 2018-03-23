import { params } from 'react-easy-stack'
import { fetchUser } from '../api'

export default async function resolveUser () {
  return { user: await fetchUser(params.id) }
}
