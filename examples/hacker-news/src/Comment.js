import React, { Component } from 'react'
import { easyComp, Link } from 'react-easy-stack'
import timeago from 'timeago.js'

class RawComment extends Component {
  store = {
    hidden: false
  }

  toggleVisibility () {
    this.store.hidden = !this.store.hidden
  }

  render () {
    const { hidden } = this.store
    const { deleted, dead, text, by, time, kids } = this.props.comment
    const timeAgo = timeago().format(time * 1000)

    if (deleted || dead || !text) {
      return null
    }

    return (
      <div className='comment'>
        <div>
          <Link to="/user" params={{ id: by }}> {by} </Link>
          {timeAgo}
          <span onClick={this.toggleVisibility}>{hidden ? `[+${kids.length}]` : '[-]'}</span>
        </div>

        {!hidden && <div>
          <div dangerouslySetInnerHTML={{ __html: text }} />
          {kids && kids.map(commentId => <Comment key={commentId} id={commentId} />)}
        </div>}
    </div>
    )
  }
}

const Comment = easyComp(RawComment)
export default Comment
