import React from 'react'
import { easyPage } from 'react-easy-stack'
import StoryItem from '../StoryItem'
import Comment from '../Comment'
import story from './store'

function StoryPage() {
  return (
    <div>
      <StoryItem {...story} />
      <div dangerouslySetInnerHTML={{ __html: story.text }} />
      {story.kids.map(commentId => <Comment key={commentId} />)}
    </div>
  )
}

export default easyPage(StoryPage, story, 'story')
