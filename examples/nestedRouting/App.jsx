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

const enterAnimation = {
  keyframes: { opacity: [0, 1], transform: ['translateX(-50px)', 'none'] },
  options: 200
}

const leaveAnimation = {
  keyframes: { opacity: [1, 0], transform: ['none', 'translateX(50px)'] },
  options: 200
}

const activeStyle = {
  textDecoration: 'underline'
}

class App extends Component {
  toggleStyle = () => {
    appStore.border = (appStore.border === 'none') ? 'solid 3px green' : 'none'
  }

  toggleProtect = () => {
    appStore.protected = !appStore.protected
  }

  onRoute = ({ toPage, fromPage, target }) => {
    if (appStore.protected && toPage === 'profile') {
      target.route({ to: '/settings/user' })
    }
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <Drawer>
            <Router defaultPage='profile' /*onRoute={this.onRoute}*/>
              <div page='profile'>
                <Link to='/profile' activeStyle={activeStyle}><MenuItem>Profile</MenuItem></Link>
                <Link to='/settings' activeStyle={activeStyle}><MenuItem>Settings</MenuItem></Link>
              </div>
              <div page='settings'>
                <Link to='privacy' activeStyle={activeStyle}><MenuItem>Privacy</MenuItem></Link>
                <Link to='user' activeStyle={activeStyle}><MenuItem>User</MenuItem></Link>
                <Link to='/profile' activeStyle={activeStyle}><MenuItem>Profile</MenuItem></Link>
              </div>
            </Router>
            <button onClick={this.toggleStyle}>Toggle Style</button>
            <button onClick={this.toggleProtect}>{appStore.protected ? 'Allow' : 'Protect'}</button>
          </Drawer>

          <Router className='page router' defaultPage='profile' enterAnimation={enterAnimation} leaveAnimation={leaveAnimation} timeout={800} onRoute={this.onRoute}>
            <Profile page='profile' /*style={{ border: appStore.border }}*//>
            <Settings page='settings' resolve={wait}/>
          </Router>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default view(App)

function wait () {
  return new Promise(resolve => setTimeout(resolve, 3000))
}
