import { store, params } from 'react-easy-stack'
import { fetchStoriesByType } from '../api'

export default store({
  stories: [],
  pages: 0,
  hasMore: true,
  async resolveStories () {
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
})
