import React from "react";
import { view, params, Link } from "react-stax";
import InfiniteScroll from "react-infinite-scroller";
import StoryItem from "../components/StoryItem";
import storiesStore from "../stores/stories";

export default view(() => {
  const { stories, prevPage, nextPage } = storiesStore;
  return (
    <div>
      {stories.map((story, idx) => (
        <StoryItem story={story} idx={idx} key={story.id} />
      ))}
      <Link params={{ page: params.page - 1 }} inherit>
        Prev page
      </Link>
      <Link params={{ page: params.page + 1 }} inherit>
        Next page
      </Link>
    </div>
  );
});
