import React, { Component } from 'react'
import { easyComp, Link, Router } from 'react-easy-stack'
import classNames from 'classnames'
import { storiesStore, StoriesPage } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'
import appStore from './appStore'
import { events } from './api'
import { STORY_TYPES } from './config'

class App extends Component {
  async onRoute ({ fromPage, toPage, params }) {
    events.removeAllListeners()

    if (toPage === 'stories') {
      await storiesStore.init(params)
    } else if (toPage === 'story') {
      await storyStore.init(params)
    } else if (toPage === 'user') {
      await userStore.init(params)
    }
  }

  render () {
    const { dark, toggleTheme } = appStore
    const appClass = classNames('app', { dark })

    return (
      <div className={appClass}>
        <nav className='topnav'>
          <div className='inner'>
            <div className='links'>
              {STORY_TYPES.map(
                type => <Link to="stories" params={{ type }} activeClass='active' key={type}>{type}</Link>
              )}
            </div>
            <div className='theme-toggle' onClick={toggleTheme}>
              THEME
            </div>
          </div>
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
