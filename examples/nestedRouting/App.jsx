import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import { Router, Link } from 'react-easy-stack'
import Profile from './Profile'
import Settings from './Settings'

export default class App extends Component {
  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Drawer>
            <Router defaultPage='profile'>
              <div page='profile'>
                <Link to='/profile'><MenuItem>Profile</MenuItem></Link>
                <Link to='/settings'><MenuItem>Settings</MenuItem></Link>
              </div>
              <div page='settings'>
                <Link to='privacy'><MenuItem>Privacy</MenuItem></Link>
                <Link to='user'><MenuItem>User</MenuItem></Link>
                <Link to='/profile'><MenuItem>Profile</MenuItem></Link>
              </div>
            </Router>
          </Drawer>

          <Router className='page router' defaultPage='profile' timeout={1000}>
            <Profile page='profile'/>
            <Settings page='settings' resolve={wait}/>
          </Router>
        </div>
      </MuiThemeProvider>
    )
  }
}

function wait () {
  throw new Error('hi')
  return new Promise(resolve => setTimeout(resolve, 3000))
}
