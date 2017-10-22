import { easyRouter } from 'react-easy-stack'

const router = {
  default: 'stories',
  pages: {
    stories: {
      comp: StoriesPage,
      store: storiesStore,
      async onRoute () {
        await this.store.fetchStories()
      }
    },
    story: {
      comp: StoryPage,
      store: storyStore,
      async onRoute () {
        await this.store.fetchStory()
      }
    },
    user: {
      comp: UserPage,
      store: userStore,
      async onRoute () {
        await this.store.fetchUser()
      }
    }
  }
}

export default easyRouter(router)
