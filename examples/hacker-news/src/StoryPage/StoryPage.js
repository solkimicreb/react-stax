import React from 'react'
import { easyComp } from 'react-easy-stack'
import StoryItem from '../StoryItem'
import Comment from '../Comment'
import store from './store'

function StoryPage() {
  const { story } = store
  return (
    <div>
      <StoryItem story={story} />
      <div dangerouslySetInnerHTML={{ __html: story.text }} />
      {story.kids && story.kids.map(commentId => <Comment key={commentId} id={commentId} />)}
    </div>
  )
}

export default easyComp(StoryPage)
