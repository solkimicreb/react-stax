import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import SearchBar from 'material-ui-search-bar';
import Button from 'material-ui/Button';
import { view, params, pages, route, Link } from 'react-easy-stack';
import Loader from './Loader';
import appStore, * as app from './appStore';

const toolbarStyle = {
  width: '100%',
  maxWidth: 840,
  margin: '0px auto',
  padding: '5px 10px',
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'space-between'
};

const searchStyle = {
  width: '60%',
  minWidth: 200
};

class NavBar extends Component {
  onSearch = search => {
    console.log('search', search);
    if (params.search !== search) {
      route({
        to: 'products',
        params: { search },
        options: { history: true, animate: true }
      });
    }
  };

  onLogout = () => {
    app.logout();
    route();
  };

  render() {
    const { isLoading, isLoggedIn } = appStore;

    return (
      <AppBar>
        <Toolbar style={toolbarStyle}>
          <SearchBar
            onRequestSearch={this.onSearch}
            value={params.search}
            style={searchStyle}
          />
          <Button color="inherit">
            {isLoggedIn ? (
              <span onClick={this.onLogout}>Logout</span>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </Button>
        </Toolbar>
        <Loader />
      </AppBar>
    );
  }
}

export default view(NavBar);
