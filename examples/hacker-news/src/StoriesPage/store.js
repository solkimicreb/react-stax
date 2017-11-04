import { easyStore } from 'react-easy-stack'
import { fetchStoriesByType, fetchStories, events } from '../api'

const store = {
  stories: [],
  type: 'top',
  hasMore: true,
  async init ({ type = this.type }) {
    this.type = type
    await this.fetchStories()
    this.hasMore = true
  },
  async fetchStories() {
    this.stories = await fetchStoriesByType(this.type, 1)
    events.removeAllListeners()
    events.on(this.type, () => this.updateStories())
  },
  async updateStories() {
    const ids = store.stories.map(story => story.id)
    this.stories = await fetchStories(ids)
  },
  async fetchPage(page) {
    const stories = await fetchStoriesByType(this.type, page)
    if (!stories.length) {
      this.hasMore = false
    } else {
      this.stories.push(...stories)
      this.hasMore = true
    }
  }
}

const params = {
  type: ['url', 'history']
}

export default easyStore(store, params)
