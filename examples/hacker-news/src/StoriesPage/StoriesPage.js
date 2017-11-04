import React from 'react'
import { easyComp } from 'react-easy-stack'
import FlipMove from 'react-flip-move'
import InfiniteScroll from 'react-infinite-scroller'
import StoryItem from '../StoryItem'
import store from './store'

window.store = store

function StoriesPage() {
  return (
    <InfiniteScroll
      loadMore={store.fetchPage}
      hasMore={store.hasMore}
      pageStart={1}
      initialLoad={false}
      threshold={500}>
      <FlipMove enterAnimation="fade" leaveAnimation="fade" duration={250}>
        {store.stories.map((story, idx) => <StoryItem {...story} idx={idx} key={story.id} />)}
      </FlipMove>
    </InfiniteScroll>
  )
}

export default easyComp(StoriesPage)
