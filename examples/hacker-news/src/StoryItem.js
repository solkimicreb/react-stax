import React from 'react'
import { view, Link } from 'react-easy-stack'
import timeago from 'timeago.js'

function StoryItem ({ idx, story }) {
  const { url, title, time, type, by, score, descendants, id } = story
  const hostname = url ? new URL(url).hostname : ''
  const timeAgo = timeago().format(time * 1000)

  return (
    <div className='story'>
      {idx !== undefined && <div className='num'>{idx}</div>}
      <div>
        <div className='header'>
          {url ? (
            <a href={url}>
              {title} <small>({hostname})</small>
            </a>
          ) : (
            <Link to='/story' params={{ id }}>
              {title}
            </Link>
          )}
        </div>

        <div className='footer'>
          {type === 'job' ? (
            <Link to='/story' params={{ id }}>
              {title}
            </Link>
          ) : (
            <div>
              {score} points by
              <Link to='/user' params={{ id: by }}>
                {' '}
                {by}{' '}
              </Link>
              <Link to='/story' params={{ id }}>
                {' '}
                {timeAgo}{' '}
              </Link>{' '}
              |
              <Link to='/story' params={{ id }}>
                {' '}
                {descendants} comments
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default view(StoryItem)
