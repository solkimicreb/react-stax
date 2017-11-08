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
    // issue if there are no kids!!
    // this keeps the old kids
    Object.assign(this, story)
  }
}

export default easyStore(store, { id: 'url' })
