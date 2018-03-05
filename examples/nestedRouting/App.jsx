import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import { Router, Link, view, store } from 'react-easy-stack'
import Profile from './Profile'
import Settings from './Settings'

const appStore = store({
  border: 'solid 3px green',
  protected: false
})

class App extends Component {
  toggleStyle = () => {
    appStore.border = (appStore.border === 'none') ? 'solid 3px green' : 'none'
  }

  toggleProtect = () => {
    appStore.protected = !appStore.protected
  }

  componentDidCatch (error, info) {
    console.log('APP', error, info)
  }

  onRoute = ({ preventDefault, toPage, fromPage, target }) => {
    console.log('onRoute', fromPage, toPage)
    if (appStore.protected && toPage === 'profile') {
      preventDefault()
      console.log('route')
      target.route({ to: '/settings/user' })
    }
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Drawer>
            <Router defaultPage='profile' onRoute={this.onRoute}>
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
            <button onClick={this.toggleProtect}>{appStore.protected ? 'Allow' : 'Protect'}</button>
          </Drawer>

          <Router className='page router' defaultPage='profile' onRoute={this.onRoute}>
            <Profile page='profile' /*resolve={wait}*/ /*style={{ border: appStore.border }}*//>
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
