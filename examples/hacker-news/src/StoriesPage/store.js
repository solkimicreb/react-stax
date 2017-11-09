import { easyStore, params } from 'react-easy-stack'
import { fetchStoriesByType, events } from '../api'

params.type = params.type || 'top'

const store = {
  type: params.type,
  stories: [],
  pages: 0,
  hasMore: true,
  async init ({ type }) {
    this.type = type || this.type
    this.stories = await fetchStoriesByType(this.type, 1)
    events.on(this.type, this.updateStories)
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

export default easyStore(store)
