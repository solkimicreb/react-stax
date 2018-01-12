import { params } from 'react-easy-stack'
import { fetchStory } from '../api'

export default function resolveStory () {
  return fetchStory(params.id)
}
