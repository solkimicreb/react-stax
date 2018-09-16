import React from 'react'
import { view, Link, Router } from 'react-stax'
import StoriesPage from './pages/Stories'
import StoryPage from './pages/Story'
import UserPage from './pages/User'
import storiesStore from './stores/stories'
import initStory from './stores/story'
import initUser from './stores/user'
import appStore from './stores/app'
import { STORY_TYPES } from './config'

function onRoute({ toPage }) {
  if (toPage === 'story') {
    return initStory()
  } else if (toPage === 'user') {
    return initUser()
  } else {
    return storiesStore.init()
  }
}

export default view(() => {
  const { loading } = appStore

  return (
    <div className="app">
      <nav className="topnav">
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
      </nav>
      <Router className="router" defaultPage="stories" onRoute={onRoute}>
        <StoriesPage page="stories" />
        <StoryPage page="story" />
        <UserPage page="user" />
      </Router>
    </div>
  )
})
