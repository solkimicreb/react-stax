import React, { Component } from 'react'
import { easyComp, Link } from 'react-easy-stack'
import timeago from 'timeago.js'
import { fetchComment } from './api'

class RawComment extends Component {
  store = {
    hidden: false,
    comment: {}
  }

  constructor (props) {
    super(props)
    this.fetchComment(props.id)
  }

  async fetchComment (id) {
    this.store.comment = await fetchComment(id)
  }

  toggleVisibility () {
    this.store.hidden = !this.store.hidden
  }

  render () {
    const { comment, hidden } = this.store
    const { deleted, dead, text, by, time, kids, id } = comment
    const timeAgo = timeago().format(time * 1000)

    if (deleted || dead || !text) {
      return null
    }

    return (
      <div className='comment'>
        <div>
          <Link to="/user" params={{ id: by }}> {by} </Link>
          <span> {timeAgo} </span>
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
