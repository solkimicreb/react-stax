import React from 'react'
import { easyComp, Link } from 'react-easy-stack'

function StoryItem({ url, title, time, type, by, score, descendants, id, idx }) {
  return (
    <div>
      <strong>{idx} </strong>
      {url
      ? <a href={url}>{title} <small>({url})</small></a>
      : <Link to="/story" params={{ id }}>{title}</Link>}

      {type === 'job'
      ? <Link to="/story" params={{ id }}>{title}</Link>
      : (
        <div>
          {score} points by
          <Link to="/user" params={{ id: by }}> {by} </Link>
          <Link to="/story" params={{ id }}> {time} ago </Link> |
          <Link to="/story" params={{ id }}> {descendants} </Link>
        </div>
      )}
    </div>
  )
}

export default easyComp(StoryItem)
