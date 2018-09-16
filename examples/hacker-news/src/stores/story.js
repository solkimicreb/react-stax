import { params } from 'react-stax'
import { fetchFullStory } from '../api'

export default function resolveStory() {
  return fetchFullStory(params.id)
}
