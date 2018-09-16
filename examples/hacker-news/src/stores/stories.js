import { store, params } from 'react-stax'
import _defaults from 'lodash/defaults'
import { fetchStoriesByType } from '../api'

const storiesStore = store({
  stories: [],
  async init() {
    _defaults(params, {
      type: 'top',
      page: 1
    })
    storiesStore.fetchPage()
  },
  async fetchPage() {
    storiesStore.stories = await fetchStoriesByType(params.type, params.page)
  }
})

export default storiesStore
