import { easyStore } from 'react-easy-stack'
import { fetchStory } from '../api'

const store = {
  id: '',
  async fetchStory () {
    const story = await fetchStory(this.id)
    Object.assign(this, story)
  }
}

const params = {
  id: ['url']
}

export default easyStore(store, params)
