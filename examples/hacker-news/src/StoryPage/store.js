import { easyStore, params } from 'react-easy-stack'
import { fetchStory } from '../api'

const store = {
  async init () {
    this.story = await fetchStory(params.id)
  }
}

export default easyStore(store)
