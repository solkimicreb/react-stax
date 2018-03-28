import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import SearchBar from 'material-ui-search-bar'
import Button from 'material-ui/Button'
import { view, params, pages, route, Link } from 'react-easy-stack'
import Loader from './Loader'
import appStore, * as app from './appStore'

const toolbarStyle = {
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between'
}

class NavBar extends Component {
  onSearch = search => {
    if (params.search !== search) {
      route({
        to: 'products',
        params: { search },
        options: { history: true, animate: true }
      })
    }
  };

  onLogout = () => {
    app.logout()
    route()
  };

  render () {
    const { isLoading, isLoggedIn } = appStore

    return (
      <AppBar>
        <Toolbar style={toolbarStyle}>
          <SearchBar onRequestSearch={this.onSearch} value={params.search} />
          <Button color='inherit'>
            {isLoggedIn ? (
              <span onClick={this.onLogout}>Logout</span>
            ) : (
              <Link to='/login'>Login</Link>
            )}
          </Button>
        </Toolbar>
        <Loader />
      </AppBar>
    )
  }
}

export default view(NavBar)
