import { easyStore } from 'react-easy-stack'
import { fetchStoriesByType, fetchStories, fetchStory, events } from '../api'

const store = {
  type: 'top',
  stories: [],
  pages: 0,
  hasMore: true,
  async init ({ type }) {
    this.type = type || this.type
    await this.fetchStories()
    events.on(this.type, this.updateStories)
    this.hasMore = true
  },
  async fetchStories () {
    this.stories = await fetchStoriesByType(this.type, 1)
  },
  async updateStories () {
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
