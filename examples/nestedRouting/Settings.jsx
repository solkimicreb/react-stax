import React, { Component } from 'react'
import { Router, Link } from 'react-easy-stack'

export default class Settings extends Component {
  render () {
    const { isLoading } = this.props
    return (
      <div>
        {isLoading && 'LOADING'}
        <Router defaultPage='privacy' timeout={500} className='router'>
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
