import React from 'react'
import { view, route, Router } from 'react-stax'
import { Header, Footer } from './components'
import { Article, Edit, Home, Login, Profile, Settings } from './pages'
import userStore from './stores/user'

// TODO: it is very easy to run into infinite loops
// we have to create some shortcuts instead!
async function onRoute({ toPage }) {
  if (!userStore.user && toPage !== 'login') {
    // do I want ot have different defaults here?
    route({ to: '/login', push: false })
  }
}

export default view(() => {
  return (
    <>
      <Header />
      <Router defaultPage="home" onRoute={onRoute}>
        <Article page="article" />
        <Edit page="edit" />
        <Home page="home" />
        <Login page="login" />
        <Profile page="profile" />
        <Settings page="settings" />
      </Router>
      <Footer />
    </>
  )
})
