import React, { Component } from 'react'
import { easyComp, Router, Link } from 'react-easy-stack'
import { StoriesPage, storiesStore } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'
import { TYPES } from './config'

class App extends Component {
  async onRoute({ fromPage, toPage, params }) {
    switch (toPage) {
      case 'stories': return await storiesStore.fetchStories()
      case 'story': return await storyStore.fetchStory()
      case 'user': return await userStore.fetchUser()
    }
  }

  render() {
    return (
      <div>
        <nav>
          {TYPES.map(
            type => <Link to="/stories" params={{ type }} key={type}>{type}</Link>
          )}
        </nav>
        <Router />

        <Router defaultPage='stories' onRoute={this.onRoute}>
          <StoriesPage page="stories" />
          <StoryPage page="story" />
          <UserPage page="user" />
        </Router>
      </div>
    )
  }
}

export default easyComp(App)
