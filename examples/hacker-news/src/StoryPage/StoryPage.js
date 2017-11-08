import React from 'react'
import { easyComp } from 'react-easy-stack'
import StoryItem from '../StoryItem'
import Comment from '../Comment'
import story from './store'

function StoryPage() {
  return (
    <div>
      <StoryItem {...story} />
      <div dangerouslySetInnerHTML={{ __html: story.text }} />
      {story.kids && story.kids.map(commentId => <Comment key={commentId} id={commentId} />)}
    </div>
  )
}

export default easyComp(StoryPage)
