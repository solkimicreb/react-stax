import { store, params } from 'react-easy-stack'
import { fetchStoriesByType } from '../api'

const storiesStore = store({
  stories: [],
  pages: 0,
  hasMore: true,
  async resolveStories () {
    storiesStore.stories = await fetchStoriesByType(
      params.type,
      0,
      storiesStore.pages
    )
  },
  async initStories () {
    return {
      stories: await fetchStoriesByType(params.type, 0, storiesStore.pages)
    }
  },
  async fetchPage (page) {
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
