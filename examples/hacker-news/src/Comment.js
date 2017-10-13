import React from 'react'
import { easyComp, Link } from 'react-easy-stack'

function Comment({ url, title, time, type, by, score, descendants, id }) {
  return (
    <div>
      {url
      ? <a href={url}>{title} <small>({url})</small></a>
      : <Link to="/story" params={{ id }}>{title}</Link>}

      {type === 'job'
      ? <Link to="/story" params={{ id }}>{title}</Link>
      : (
        <div>
          {score} points by
          <Link to="/user" params={{ id: by }}>{by}</Link>
          <Link to="/story" params={{ id }}>{time} ago</Link> |
          <Link to="/story" params={{ id }}>{descendants}</Link>
        </div>
      )}
    </div>
  )
}

export default easyComp(Comment)
