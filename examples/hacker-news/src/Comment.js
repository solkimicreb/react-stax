import React, { Component } from 'react'
import { easyComp, Link } from 'react-easy-stack'
import { fetchComment, events } from './api'
import TimeAgo from './TimeAgo'

class RawComment extends Component {
  store = {
    hidden: false,
    comment: {}
  }

  constructor (props) {
    super(props)
    this.initComment(props.id)
  }

  async initComment (id) {
    this.store.comment = await fetchComment(id)
    events.on('updates', items => this.updateComment(items))
  }

  async updateComment (items) {
    const { id } = this.store.comment
    if (items.has(id)) {
      this.store.comment = await fetchComment(id)
    }
  }

  toggleVisibility () {
    this.store.hidden = !this.store.hidden
  }

  render () {
    const { comment, hidden } = this.store
    const { deleted, dead, text, by, time, kids } = comment

    if (deleted || dead || !text) {
      return null
    }

    return (
      <div className='comment'>
        <div>
          <Link to="/user" params={{ id: by }}> {by} </Link>
          <TimeAgo startTime={time} />
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
