import { easyStore } from 'react-easy-stack'
import { fetchStoriesByType, fetchStories, events } from '../api'

const store = {
  type: 'top',
  stories: [],
  pages: 0,
  hasMore: true,
  async init ({ type }) {
    this.type = type || this.type
    await this.fetchStories()
    this.hasMore = true
  },
  async fetchStories() {
    this.stories = await fetchStoriesByType(this.type, 1)
    events.removeAllListeners()
    events.on(this.type, ids => this.updateStories(ids))
  },
  async updateStories() {
    this.stories = await fetchStoriesByType(this.type, 0, this.pages)
  },
  async fetchPage(page) {
    const stories = await fetchStoriesByType(this.type, page)
    if (!stories.length) {
      this.hasMore = false
    } else {
      this.stories.push(...stories)
      this.hasMore = true
    }
    this.pages = page
  }
}

export default easyStore(store, { type: 'url' })
