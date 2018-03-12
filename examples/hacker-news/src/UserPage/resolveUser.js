import { params } from 'react-easy-stack'
import { fetchUser } from '../api'

export default function resolveUser () {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
    fetchUser(params.id)
  )
  // return fetchUser(params.id)
}
