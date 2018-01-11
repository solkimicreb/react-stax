import { easyStore, params } from 'react-easy-stack'
import { fetchStoriesByType } from '../api'

params.type = params.type || 'top'

const store = {
  stories: [],
  pages: 0,
  hasMore: true,
  async init () {
    await this.updateStories()
  },
  async updateStories () {
    this.stories = await fetchStoriesByType(params.type, 0, this.pages)
  },
  async fetchPage(page) {
    const stories = await fetchStoriesByType(params.type, page)
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
