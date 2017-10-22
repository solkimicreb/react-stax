import React from 'react'
import { easyPage } from 'react-easy-stack'
import FlipMove from 'react-flip-move'
import InfiniteScroll from 'react-infinite-scroller'
import StoryItem from '../StoryItem'
import store from './store'

function StoriesPage() {
  return (
    <InfiniteScroll
      loadMore={store.fetchPage}
      hasMore={store.hasMore}
      pageStart={1}
      initialLoad={false}
      threshold={500}>
      <FlipMove enterAnimation="fade" leaveAnimation="fade">
        {store.stories.map(story => <StoryItem {...story} key={story.id} />)}
      </FlipMove>
    </InfiniteScroll>
  )
}

export default easyPage(StoriesPage, store, 'stories')
