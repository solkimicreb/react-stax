import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { Router, Link } from 'react-easy-stack'

export default class Settings extends Component {
  render () {
    return (
      <div>
        <Link to='privacy'>Privacy</Link>
        <Link to='user'>User</Link>
        <Router defaultPage='privacy'>
          <div page='privacy'>Privacy Settings</div>
          <div page='user'>User Settings</div>
        </Router>
      </div>
    )
  }
}
