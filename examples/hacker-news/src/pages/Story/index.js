import React from "react";
import { view } from "react-stax";
import StoryItem from "../../components/StoryItem";
import Comment from "./Comment";

export default view(story => (
  <div>
    <StoryItem story={story} />
    <div dangerouslySetInnerHTML={{ __html: story.text }} />
    {story.comments &&
      story.comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
  </div>
));
