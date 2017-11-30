import React from 'react'
import { easyComp } from 'react-easy-stack'
import FlipMove from 'react-flip-move'
import InfiniteScroll from 'react-infinite-scroller'
import StoryItem from '../StoryItem'
import store from './store'

function StoriesPage() {
  const { fetchPage, hasMore, initing, stories } = store
  return (
    <InfiniteScroll
      loadMore={fetchPage}
      hasMore={hasMore}
      pageStart={1}
      initialLoad={false}
      threshold={500}>
      <FlipMove enterAnimation="fade" leaveAnimation="fade" duration={250} disableAllAnimations={initing}>
        {stories.map((story, idx) => <StoryItem story={story} idx={idx} key={story.id} />)}
      </FlipMove>
    </InfiniteScroll>
  )
}

export default easyComp(StoriesPage)
