import React, { Component } from 'react'
import classNames from 'classnames'
import { easyComp, Link, Router, Lazy } from 'react-easy-stack'
import { storiesStore, StoriesPage } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'
import { STORY_TYPES } from './config'

class App extends Component {
  async onRoute ({ toPage, params }) {
    if (toPage === 'stories') {
      await storiesStore.init(params)
    } else if (toPage === 'story') {
      await storyStore.init(params)
    } else if (toPage === 'user') {
      await userStore.init(params)
    }
  }

  render () {
    return (
      <div>
        <nav>
          {STORY_TYPES.map(
            type => <Link to="stories" params={{ type }} activeClass='active' key={type}>{type}</Link>
          )}
        </nav>
        <Router className='router' enterClass='enter' leaveClass='leave' duration={200} onRoute={this.onRoute}>
          <StoriesPage page="stories" default />
          <StoryPage page="story" />
          <UserPage page="user" />
        </Router>
      </div>
    )
  }
}

export default easyComp(App)
