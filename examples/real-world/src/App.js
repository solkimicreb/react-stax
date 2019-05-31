import React from 'react'
import { view, Router } from 'react-stax'
import { Header, Footer } from './components'
import { Article, Edit, Home, Login, Profile, Settings } from './pages'

export default view(() => {
  return (
    <>
      <Header />
      <Router defaultPage="home">
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
