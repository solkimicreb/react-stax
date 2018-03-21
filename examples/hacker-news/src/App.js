import React from 'react'
import { view, Link, Router } from 'react-easy-stack'
import classNames from 'classnames'
import { StoriesPage, initStories } from './StoriesPage'
import { StoryPage, resolveStory } from './StoryPage'
import { UserPage, resolveUser } from './UserPage'
import appStore from './appStore'
import { STORY_TYPES } from './config'

const enterAnimation = {
  keyframes: { opacity: [0, 1], transform: ['translateX(-15px)', 'none'] },
  options: 500
}

const leaveAnimation = {
  keyframes: { opacity: [1, 0], transform: ['none', 'translateX(15px)'] },
  options: 500
}

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
                options={{ history: true }}
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
        animate={true}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        <StoriesPage
          page='stories'
          resolve={initStories}
          defaultParams={{ type: 'top' }}
        />
        <StoryPage page='story' resolve={resolveStory} />
        <UserPage page='user' resolve={resolveUser} />
      </Router>
    </div>
  )
}

export default view(App)
