import { easyStore } from 'react-easy-stack'
import { fetchStory } from '../api'

const store = {
  id: '',
  async init ({ id = this.id }) {
    this.id = id
    await this.fetchStory()
  },
  async fetchStory () {
    const story = await fetchStory(this.id)
    Object.assign(this, story)
  }
}

const params = {
  id: ['url']
}

export default easyStore(store, params)
