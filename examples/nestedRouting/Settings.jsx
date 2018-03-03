import React, { Component } from 'react'
import { Router, Link } from 'react-easy-stack'

export default class Settings extends Component {
  render () {
    const { pageStatus } = this.props
    return (
      <div>
        status: {pageStatus}
        <Router defaultPage='privacy' className='router'>
          <div page='privacy'>Privacy Settings</div>
          <div page='user'>User Settings</div>
        </Router>
      </div>
    )
  }
}

function wait () {
  return new Promise(resolve => setTimeout(resolve, 3000))
}
