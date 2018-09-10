import React, { Component, Fragment } from 'react'
import { Router, view, params, route } from 'react-stax'
import NavBar from './NavBar'
import ProductList from './ProductList'
import ProductEditor from './ProductEditor'
import Login from './Login'
import Notification, { notify } from './Notification'
import appStore, * as app from './appStore'

const appStyle = {
  maxWidth: 880,
  margin: '50px auto',
  position: 'relative',
  padding: 20
}

const enterAnimation = elem =>
  elem.animate(
    {
      opacity: [0, 1],
      transform: ['translateX(-10px)', 'none']
    },
    {
      delay: 2000,
      duration: 20000,
      fill: 'both'
    }
  ).finished

const leaveAnimation = elem =>
  elem.animate(
    {
      opacity: [1, 0],
      transform: ['none', 'translateX(10px)']
    },
    {
      duration: 20000,
      fill: 'both'
    }
  ).finished

class App extends Component {
  onRoute = async ({ toPage }) => {
    if (toPage === 'product') {
      if (appStore.isLoggedIn) {
        await app.resolveProduct()
      } else {
        route({ to: '/login' })
        notify('You must be logged in to access the product editor page')
      }
    } else if (toPage === 'products') {
      await app.search()
    }
  }

  render() {
    return (
      <Fragment>
        <NavBar />
        <Router
          defaultPage="products"
          onRoute={this.onRoute}
          style={appStyle}
          enterAnimation={enterAnimation}
          leaveAnimation={leaveAnimation}
          shouldAnimate={true}
        >
          <ProductList page="products" />
          <ProductEditor page="product" />
          <Login page="login" />
        </Router>
        <Notification />
      </Fragment>
    )
  }
}

export default view(App)
