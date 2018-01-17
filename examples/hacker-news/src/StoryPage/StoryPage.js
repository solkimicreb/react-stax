import React from 'react'
import { view } from 'react-easy-stack'
import StoryItem from '../StoryItem'
import Comment from '../Comment'

function StoryPage (story) {
  return (
    <div>
      <StoryItem story={story} />
      <div dangerouslySetInnerHTML={{ __html: story.text }} />
      {story.kids && story.kids.map(commentId => <Comment key={commentId} id={commentId} />)}
    </div>
  )
}

export default view(StoryPage)
