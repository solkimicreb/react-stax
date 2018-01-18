import React from 'react'
import { view, Link, Router } from 'react-easy-stack'
import classNames from 'classnames'
import { StoriesPage, resolveStories } from './StoriesPage'
import { StoryPage, resolveStory } from './StoryPage'
import { UserPage, resolveUser } from './UserPage'
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
            {STORY_TYPES.map(type => (
              <Link
                to='stories'
                params={{ type }}
                activeClass='active'
                key={type}
              >
                {type}
              </Link>
            ))}
          </div>
          <div className={themeClass} onClick={toggleTheme}>
            THEME
          </div>
        </div>
      </nav>
      <Router
        className='router'
        defaultPage='stories'
        alwaysRoute
        enterClass='enter'
        leaveClass='leave'
        duration={150}
      >
        <StoriesPage
          page='stories'
          resolve={resolveStories}
          defaultParams={{ type: 'top' }}
        />
        <StoryPage page='story' resolve={resolveStory} />
        <UserPage page='user' resolve={resolveUser} />
      </Router>
    </div>
  )
}

export default view(App)
