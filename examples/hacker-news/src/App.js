import React from 'react'
import { view, Link, Router, params } from 'react-stax'
import classNames from 'classnames'
import { StoriesPage, resolveStories } from './StoriesPage'
import { StoryPage, resolveStory } from './StoryPage'
import { UserPage, resolveUser } from './UserPage'
import appStore from './appStore'
import { STORY_TYPES } from './config'

const enterAnimation = elem =>
  elem.animate(
    {
      opacity: [0, 1]
    },
    {
      duration: 150
    }
  ).finished

const leaveAnimation = elem => {
  const { top, left, width, height } = elem.getBoundingClientRect()

  // TODO: top is somewhy 65 instead of 50
  Object.assign(elem.style, {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  })

  return elem.animate(
    {
      opacity: [1, 0]
    },
    {
      duration: 150
    }
  ).finished
}

function onRoute({ toPage }) {
  if (toPage === 'story') {
    return resolveStory()
  } else if (toPage === 'user') {
    return resolveUser()
  } else {
    params.type = params.type || 'top'
    return resolveStories()
  }
}

function App() {
  const { loading, dark, toggleTheme } = appStore
  const appClass = classNames('app', { dark })
  const themeClass = classNames('theme-toggle', { loading })

  return (
    <div className={appClass}>
      <nav className="topnav">
        <div className="inner">
          <div className="links">
            {STORY_TYPES.map(type => (
              <Link
                to="stories"
                params={{ type }}
                activeClass="active"
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
        className="router"
        defaultPage="stories"
        onRoute={onRoute}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        <StoriesPage page="stories" />
        <StoryPage page="story" />
        <UserPage page="user" />
      </Router>
    </div>
  )
}

export default view(App)
