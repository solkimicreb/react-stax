import React from 'react'
import { easyComp, Link, Router } from 'react-easy-stack'
import classNames from 'classnames'
import { storiesStore, StoriesPage } from './StoriesPage'
import { StoryPage, storyStore } from './StoryPage'
import { UserPage, userStore } from './UserPage'
import appStore from './appStore'
import { STORY_TYPES } from './config'

function App () {
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
      <Router className='router' defaultPage='stories' alwaysRoute={true}
        enterClass='enter' leaveClass='leave' duration={150}>
        <StoriesPage page='stories' resolve={storiesStore.init} />
        <StoryPage page='story' resolve={storyStore.init} />
        <UserPage page='user' resolve={userStore.init} />
      </Router>
    </div>
  )
}

export default easyComp(App)
