import { easyStore, params } from 'react-easy-stack'
import { fetchStory } from '../api'

const store = {
  id: params.id,
  async init ({ id }) {
    this.id = id || this.id
    this.story = await fetchStory(this.id)
  }
}

export default easyStore(store)
