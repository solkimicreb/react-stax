import React, { Component } from "react";
import { view, store, Link } from "react-stax";
import timeago from "timeago.js";
import { fetchComment } from "../../api";

class RawComment extends Component {
  store = store({
    hidden: false
  });

  toggleVisibility = () => {
    this.store.hidden = !this.store.hidden;
  };

  render() {
    const { hidden } = this.store;
    const {
      deleted,
      dead,
      text,
      by,
      time,
      kids,
      id,
      comments
    } = this.props.comment;
    const timeAgo = timeago().format(time * 1000);

    if (deleted || dead || !text) {
      return null;
    }

    return (
      <div className="comment">
        <div>
          <Link to="/user" params={{ id: by }}>
            {" "}
            {by}{" "}
          </Link>
          {timeAgo}
          <span onClick={this.toggleVisibility}>{hidden ? "[+]" : "[-]"}</span>
        </div>

        {!hidden && (
          <div>
            <div dangerouslySetInnerHTML={{ __html: text }} />
            {comments &&
              comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
              ))}
          </div>
        )}
      </div>
    );
  }
}

const Comment = view(RawComment);
export default Comment;
