import React from 'react';
import { view, Link, Router, params } from 'react-easy-stack';
import classNames from 'classnames';
import { StoriesPage, resolveStories } from './StoriesPage';
import { StoryPage, resolveStory } from './StoryPage';
import { UserPage, resolveUser } from './UserPage';
import appStore from './appStore';
import { STORY_TYPES } from './config';

const enterAnimation = {
  keyframes: {
    opacity: [0.2, 1],
    transform: ['translateX(-15px)', 'none']
  },
  fill: 'both',
  delay: 50,
  duration: 200
};

const leaveAnimation = {
  keyframes: { opacity: [1, 0.2] },
  duration: 150
};

function onRoute({ toPage }) {
  if (toPage === 'story') {
    return resolveStory();
  } else if (toPage === 'user') {
    return resolveUser();
  } else {
    params.type = params.type || 'top';
    return resolveStories();
  }
}

function App() {
  const { loading, dark, toggleTheme } = appStore;
  const appClass = classNames('app', { dark });
  const themeClass = classNames('theme-toggle', { loading });

  return (
    <div className={appClass}>
      <nav className="topnav">
        <div className="inner">
          <div className="links">
            {STORY_TYPES.map(type => (
              <Link
                to="stories"
                params={{ type }}
                options={{ history: true }}
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
  );
}

export default view(App);
