import { easyRouter } from 'react-easy-stack'
import { StoriesPage, storiesStore } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'

const router = {
  default: 'stories',
  pages: {
    stories: {
      comp: StoriesPage,
      store: storiesStore,
      async resolve () {
        await this.store.fetchStories()
      }
    },
    story: {
      comp: StoryPage,
      store: storyStore,
      async resolve () {
        await this.store.fetchStory()
      }
    },
    user: {
      comp: UserPage,
      store: userStore,
      async resolve () {
        await this.store.fetchUser()
      }
    }
  }
}

export default easyRouter(router)
