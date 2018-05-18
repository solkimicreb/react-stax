import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import { view, params, pages, route, Link } from "react-easy-stack";
import SearchBar from "./SearchBar";
import Loader from "./Loader";
import appStore, * as app from "./appStore";

const toolbarStyle = {
  width: "100%",
  maxWidth: 840,
  margin: "0px auto",
  padding: "5px 15px",
  display: "flex",
  justifyContent: "space-between"
};

class NavBar extends Component {
  onSearch = search => {
    if (params.search !== search) {
      route({
        to: "products",
        params: { search },
        options: { history: true, animate: true }
      });
    }
  };

  render() {
    const { isLoading, isLoggedIn } = appStore;

    return (
      <AppBar>
        <Toolbar style={toolbarStyle}>
          <SearchBar onSearch={this.onSearch} value={params.search} />
          {isLoggedIn ? (
            <Link to="/login" onClick={app.logout}>
              <Button color="inherit">Logout</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
        <Loader />
      </AppBar>
    );
  }
}

export default view(NavBar);
