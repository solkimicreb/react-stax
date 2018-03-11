import React, { Component } from 'react'
import { Router, Link } from 'react-easy-stack'

const enterAnimation = {
  keyframes: { opacity: [0, 1] },
  options: 200
}

const leaveAnimation = {
  keyframes: { opacity: [1, 0] },
  options: 200
}

export default class Settings extends Component {
  render () {
    const { pageResolved } = this.props
    return (
      <div>
        status: {pageResolved ? 'loaded' : 'loading'}
        <Router defaultPage='privacy' className='router' enterAnimation={enterAnimation} leaveAnimation={leaveAnimation} timeout={1000}>
          <div page='privacy' resolve={wait}>Privacy Settings</div>
          <div page='user'>User Settings</div>
        </Router>
      </div>
    )
  }
}

function wait () {
  return new Promise(resolve => setTimeout(resolve, 3000))
}
