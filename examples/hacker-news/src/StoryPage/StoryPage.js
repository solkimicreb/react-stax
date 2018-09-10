import React from 'react'
import { view } from 'react-stax'
import StoryItem from '../StoryItem'
import Comment from '../Comment'

function StoryPage({ story }) {
  const { text, comments } = story
  return (
    <div>
      <StoryItem story={story} />
      <div dangerouslySetInnerHTML={{ __html: text }} />
      {comments &&
        comments.map(comment => <Comment key={comment.id} comment={comment} />)}
    </div>
  )
}

export default view(StoryPage)
