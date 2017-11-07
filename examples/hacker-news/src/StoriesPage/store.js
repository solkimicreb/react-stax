import { easyStore } from 'react-easy-stack'
import { fetchStoriesByType, fetchStories, events } from '../api'

const store = {
  stories: [],
  type: 'top',
  hasMore: true,
  async init ({ type }) {
    this.type = type || this.type
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

export default easyStore(store, { type: 'url' })
