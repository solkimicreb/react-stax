import { params } from 'react-easy-stack'
import { fetchUser } from '../api'

export default function resolveUser () {
  return fetchUser(params.id)
}
