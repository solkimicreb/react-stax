import { store, params } from 'react-stax'
import { fetchStoriesByType } from '../api'

const storiesStore = store({
  stories: [],
  pages: 0,
  hasMore: true,
  async init() {
    storiesStore.stories = await fetchStoriesByType(
      params.type,
      0,
      storiesStore.pages
    )
  },
  async fetchPage(page) {
    const stories = await fetchStoriesByType(params.type, page)
    if (!stories.length) {
      storiesStore.hasMore = false
    } else {
      storiesStore.stories.push(...stories)
      storiesStore.hasMore = true
    }
    storiesStore.pages = page
  }
})

export default storiesStore
