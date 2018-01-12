import React, { Component } from 'react'
import { easyComp, Link } from 'react-easy-stack'
import timeago from 'timeago.js'
import { fetchComment } from './api'

class RawComment extends Component {
  store = {
    hidden: false,
    comment: {}
  }

  async componentDidMount () {
    this.store.comment = await fetchComment(this.props.id)
  }

  toggleVisibility () {
    this.store.hidden = !this.store.hidden
  }

  render () {
    const { hidden, comment } = this.store
    const { deleted, dead, text, by, time, kids } = comment
    const timeAgo = timeago().format(time * 1000)

    if (deleted || dead || !text) {
      return null
    }

    return (
      <div className='comment'>
        <div>
          <Link to="/user" params={{ id: by }}> {by} </Link>
          {timeAgo}
          <span onClick={this.toggleVisibility}>{hidden ? '[+]' : '[-]'}</span>
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
