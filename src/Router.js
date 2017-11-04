import React, { Component, PropTypes, Children } from 'react'
import { registerRouter, releaseRouter, route, routeInitial } from './core'
import { normalizePath } from './urlUtils'
import { appStores, activePageStores } from './stores'
import { isRouting } from './status'
import Lazy from './Lazy'

export default class Router extends Component {
  static propTypes = {
    onRoute: PropTypes.func
  }

  static childContextTypes = {
    easyRouterDepth: PropTypes.number
  };

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  };

  get depth () {
    return this.context.easyRouterDepth || 0
  }

  getChildContext () {
    return {
      easyRouterDepth: this.depth + 1
    }
  }

  componentWillMount () {
    registerRouter(this, this.depth)
  }

  componentDidMount () {
    if (!isRouting()) {
      routeInitial()
    }
  }

  componentWillUnmount () {
    releaseRouter(this, this.depth)
  }

  route (path, params) {
    const pages = normalizePath(path, this.depth)
    return route(pages, params)
  }

  routeRouter (toPageName, params) {
    const { default: defaultPageName, children } = this.props

    let toPage
    Children.forEach(children, child => {
      const childName = child.props.page
      if (childName === toPageName || (!toPage && childName === defaultPageName)) {
        toPage = child
      }
    })
    toPageName = toPage.props.page

    // throw an error if the default page is not in a child!
    // get page names!!

    const event = {
      target: this,
      fromPage: this.currentPageName,
      toPage: toPageName,
      params,
      preventDefault () {
        this.defaultPrevented = true
      }
    }

    return Promise.resolve()
      .then(() => this.dispatchRouteEvent(event))
      .catch(console.error)
      .then(() => toPage.type === Lazy ? toPage.props.load() : toPage)
      .then(toPage => {
        if (this.currentPage !== toPage && !event.defaultPrevented) {
          this.currentPage = toPage
          this.currentPageName = toPageName
          this.forceUpdate()
        }
        // later return the event -> defaultPrevented can be fetched and routing can be halted
        return toPageName
      })
  }

  dispatchRouteEvent (event) {
    const { onRoute } = this.props
    if (onRoute) {
      return onRoute(event)
    }
  }

  render () {
    return this.currentPage || null
  }
}
