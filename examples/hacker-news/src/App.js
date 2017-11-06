import React, { Component } from 'react'
import { easyComp, Link, Router, Lazy } from 'react-easy-stack'
import { storiesStore, StoriesPage } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'
// rename to STORY_TYPES
import { TYPES } from './config'

class App extends Component {
  async onRoute ({ toPage, params }) {
    switch (toPage) {
      case 'stories': return storiesStore.init(params)
      case 'story': return storyStore.init(params)
      case 'user': return userStore.init(params)
    }
  }

  render () {
    return (
      <div>
        <nav>
          {TYPES.map(
            type => <Link to="stories" params={{ type }} key={type}>{type}</Link>
          )}
        </nav>
        <Router default="stories" onRoute={this.onRoute}>
          <StoriesPage page="stories" />
          <StoryPage page="story" />
          <UserPage page="user" />
        </Router>
      </div>
    )
  }
}

async function loadStoriesPage () {
  const { StoriesPage } = await import('./StoriesPage')
  return <StoriesPage />
}

async function loadStoriesStore (params) {
  const { storiesStore } = await import('./StoriesPage')
  return storiesStore.init(params)
}

export default easyComp(App)
