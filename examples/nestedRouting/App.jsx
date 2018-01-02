import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Router, Link } from 'react-easy-stack'
import Profile from './Profile'
import Settings from './Settings'

export default class App extends Component {
  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Drawer>
            <Link to='/profile'><MenuItem>Profile</MenuItem></Link>
            <Link to='/settings'><MenuItem>Settings</MenuItem></Link>
          </Drawer>

          <Router className='page' defaultPage='profile'>
            <Profile page='profile' />
            <Settings page='settings' />
          </Router>
        </div>
      </MuiThemeProvider>
    )
  }
}
