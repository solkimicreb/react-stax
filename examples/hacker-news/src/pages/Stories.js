import React from 'react'
import { view } from 'react-stax'
import InfiniteScroll from 'react-infinite-scroller'
import StoryItem from '../components/StoryItem'
import storiesStore from '../stores/stories'

export default view(() => {
  const { fetchPage, hasMore, stories } = storiesStore
  return (
    <InfiniteScroll
      loadMore={fetchPage}
      hasMore={hasMore}
      pageStart={1}
      initialLoad={false}
      threshold={400}
    >
      {stories.map((story, idx) => (
        <StoryItem story={story} idx={idx} key={story.id} />
      ))}
    </InfiniteScroll>
  )
})
