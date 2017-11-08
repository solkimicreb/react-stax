import React, { Component } from 'react'
import { easyComp, Link } from 'react-easy-stack'
import { fetchStory, events } from './api'
import TimeAgo from './TimeAgo'

class StoryItem extends Component {
  store = {
    story: {}
  }

  constructor (props) {
    super(props)

    this.store.story = props.story
    events.on('updates', items => this.updateStory(items))
  }

  async updateStory (items) {
    const { id } = this.store.story
    if (items.has(id)) {
      this.store.story = await fetchStory(id)
    }
  }

  render () {
    const { idx } = this.props
    const { url, title, time, type, by, score, descendants, id } = this.store.story
    const hostname = url ? new URL(url).hostname : ''

    return (
      <div className='story'>
        {idx !== undefined && <div className='num'>{idx}</div>}
        <div>
          <div className='header'>
            {url
            ? <a href={url}>{title} <small>({hostname})</small></a>
            : <Link to="/story" params={{ id }}>{title}</Link>}
          </div>

          <div className='footer'>
            {type === 'job'
            ? <Link to="/story" params={{ id }}>{title}</Link>
            : (
              <div>
                {score} points by
                <Link to="/user" params={{ id: by }}> {by} </Link>
                <Link to="/story" params={{ id }}> <TimeAgo startTime={time} /> </Link> |
                <Link to="/story" params={{ id }}> {descendants} comments</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default easyComp(StoryItem)
