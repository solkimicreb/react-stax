import React, { Component } from 'react'
import { easyComp, Link, Router, params } from 'react-easy-stack'
import classNames from 'classnames'
import { storiesStore, StoriesPage } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'
import appStore from './appStore'
import { events } from './api'
import { STORY_TYPES } from './config'

class App extends Component {
  async onRoute ({ fromPage, toPage }) {
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
    const { loading, dark, toggleTheme } = appStore
    const appClass = classNames('app', { dark })
    const themeClass = classNames('theme-toggle', { loading })

    return (
      <div className={appClass}>
        <nav className='topnav'>
          <div className='inner'>
            <div className='links'>
              {STORY_TYPES.map(
                type => <Link to="stories" params={{ type }} activeClass='active' key={type}>{type}</Link>
              )}
            </div>
            <div className={themeClass} onClick={toggleTheme}>
              THEME
            </div>
          </div>
        </nav>
        <Router className='router' defaultPage='stories' onRoute={this.onRoute}
          enterClass='enter' leaveClass='leave' duration={200}>
          <StoriesPage page="stories" />
          <StoryPage page="story" />
          <UserPage page="user" />
        </Router>
      </div>
    )
  }
}

export default easyComp(App)
