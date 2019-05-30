import React, { Fragment } from "react";
import { view, Router } from "react-stax";
import { Header, Footer } from "./components";
import { Article, Edit, Home, Login, Profile, Settings } from "./pages";

export default view(() => {
  return (
    <Fragment>
      <Header />
      <Router defaultPage="home">
        <Article page="article" />
        <Edit page="edit" />
        <Home page="home" />
        <Login home="login" />
        <Profile home="profile" />
        <Settings home="settings" />
      </Router>
      <Footer />
    </Fragment>
  );
});
