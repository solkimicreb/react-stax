import React, { Component } from 'react'
import classNames from 'classnames'
import { easyComp, Link, Router, Lazy } from 'react-easy-stack'
import { storiesStore, StoriesPage } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'
// rename to STORY_TYPES
import { TYPES } from './config'

class App extends Component {
  store = {
    isRouting: false
  }

  async onRoute ({ fromPage, toPage, params }) {
    if (fromPage !== toPage) {
      this.store.isRouting = true
    }

    if (toPage === 'stories') {
      await storiesStore.init(params)
    } else if (toPage === 'story') {
      await storyStore.init(params)
    } else if (toPage === 'user') {
      await userStore.init(params)
    }

    this.store.isRouting = false
  }

  render () {
    const routerClass = classNames('router', { routing: this.store.isRouting })

    return (
      <div>
        <nav>
          {TYPES.map(
            type => <Link to="stories" params={{ type }} activeClass='active' key={type}>{type}</Link>
          )}
        </nav>
        <Router className={routerClass} onRoute={this.onRoute}>
          <StoriesPage page="stories" default />
          <StoryPage page="story" />
          <UserPage page="user" />
        </Router>
      </div>
    )
  }
}

export default easyComp(App)
