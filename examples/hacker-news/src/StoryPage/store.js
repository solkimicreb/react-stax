import { easyStore } from 'react-easy-stack'
import { fetchStory, events } from '../api'

const store = {
  id: '',
  async init ({ id }) {
    this.id = id || this.id
    await this.fetchStory()
  },
  async fetchStory () {
    this.story = await fetchStory(this.id)
  }
}

export default easyStore(store, { id: 'url' })
