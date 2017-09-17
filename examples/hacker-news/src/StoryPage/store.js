import { easyStore, easyParams } from 'react-easy-stack'
import { fetchStory } from '../api'

const store = easyStore({
  id: '',
  async fetchStory () {
    const story = await fetchStory(this.id)
    Object.assign(this, story)
  }
})

easyParams(store, {
  id: ['url']
})

export default store
