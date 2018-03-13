import React from 'react'
import { view } from 'react-easy-stack'
import InfiniteScroll from 'react-infinite-scroller'
import StoryItem from '../StoryItem'
import store from './store'

function StoriesPage (props) {
  let { fetchPage, hasMore, stories } = store
  stories = props.stories || stories
  return (
    <InfiniteScroll
      loadMore={fetchPage}
      hasMore={hasMore}
      pageStart={1}
      initialLoad={false}
      threshold={500}
    >
      {stories.map((story, idx) => (
        <StoryItem story={story} idx={idx} key={story.id} />
      ))}
    </InfiniteScroll>
  )
}

export default view(StoriesPage)
