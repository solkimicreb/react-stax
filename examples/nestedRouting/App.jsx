import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import { Router, Link, view, store } from 'react-easy-stack'
import Profile from './Profile'
import Settings from './Settings'

const appStore = store({
  border: 'solid 3px green'
})

class App extends Component {
  toggleStyle = () => {
    appStore.border = (appStore.border === 'none') ? 'solid 3px green' : 'none'
  }

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
            <button onClick={this.toggleStyle}>Toggle Style</button>
          </Drawer>

          <Router className='page router' defaultPage='profile'>
            <Profile page='profile' style={{ border: appStore.border }}/>
            <Settings page='settings'/>
          </Router>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default view(App)

function wait () {
  throw new Error('hi')
  return new Promise(resolve => setTimeout(resolve, 3000))
}
