import React, { PureComponent, Children, PropTypes } from 'react'
import { routers, registerRouter, releaseRouter } from './core'
import { updatePathToken, trimPathTokens } from './urlUtils'

// namespacedepth in some crazy way!
// super simple -> just parse the url token and route based on that!
export default class Router extends PureComponent {
  static PropTypes = {
    onRoute: PropTypes.func
  };

  static childContextTypes = {
    easyRouterDepth: PropTypes.number
  };

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  };

  getChildContext () {
    const ownDepth = this.context.easyRouterDepth
    return {
      easyRouterDepth: ownDepth ? ownDepth + 1 : 1
    }
  }

  componentWillMount () {
    const depth = this.context.easyRouterDepth || 0
    registerRouter(this, depth)
  }

  componentWillUnmount () {
    const depth = this.context.easyRouterDepth || 0
    releaseRouter(this, depth)
  }

  route (token) {
    const { onRoute } = this.props

    if (this.currentPage === token) {
      return
    }
    // this should be toggleable from onRoute too
    this.currentPage = token

    let routing = Promise.resolve()
    if (onRoute) {
      const ev = { target: this }
      routing = routing.then(() => onRoute(ev))
    }
    // decide if I still want to route here!!
    // only call forceUpdate here if the current route is not matching with the token
    routing.then(() => this.forceUpdate())
  }

  render () {
    let selectedPage, defaultPage

    Children.forEach(this.props.children, child => {
      if (!child.props.page) {
        throw new Error('Every router child must have page property')
      }
      if (child.props.page === this.currentPage) {
        if (selectedPage) {
          throw new Error(
            'Using the same page name for two child in the same router is forbidden'
          )
        }
        selectedPage = child
      }
      if (child.props.default) {
        if (defaultPage) {
          throw new Error('A router can only have one default page at max')
        }
        defaultPage = child
      }
    })

    const currentPage = selectedPage || defaultPage || null
    this.currentPage = currentPage ? currentPage.props.page : ''
    const depth = this.context.easyRouterDepth || 0
    updatePathToken(this.currentPage, depth)
    return currentPage
  }
}
