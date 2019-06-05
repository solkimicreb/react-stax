import { params } from 'react-stax'
import { fetchUser } from '../api'

export default function resolveUser () {
  return fetchUser(params.id)
}
