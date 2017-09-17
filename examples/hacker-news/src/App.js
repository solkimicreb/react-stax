import React, { Component } from 'react'
import { easyComp, Router, Link } from 'react-easy-stack'
import StoriesPage from './StoriesPage'
import StoryPage from './StoryPage'
import UserPage from './UserPage'
import { TYPES } from './config'
import store from './store'

class App extends Component {
  async onRoute({ newPage }) {
    // this is also called when the params change only
    switch (newPage) {
      case 'stories': await store.fetchStories()
      case 'story': await store.fetchStory()
      case 'user': await store.fetchUser()
    }
  }

  render() {
    return (
      <div>
        <nav>
          {TYPES.map(
            type => <Link to="/stories" params={{ type }}>{type}</Link>
          )}
        </nav>

        <Router onRoute={this.onRoute}>
          <StoriesPage page="stories" default />
          <StoryPage page="story" />
          <UserPage page="user" />
        </Router>
      </div>
    )
  }
}

export default easyComp(App)
