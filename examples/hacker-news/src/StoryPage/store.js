import { easyStore } from 'react-easy-stack'
import { fetchStory } from '../api'

const store = {
  id: '',
  async init ({ id }) {
    this.id = id || this.id
    await this.fetchStory()
  },
  async fetchStory () {
    const story = await fetchStory(this.id)
    Object.assign(this, story)
  }
}

export default easyStore(store, { id: 'url' })
