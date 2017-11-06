import React, { Component, PropTypes, Children } from 'react'
import { registerRouter, releaseRouter, route, routeInitial } from './core'
import { normalizePath } from './urlUtils'
import { appStores, activePageStores } from './stores'
import { isRouting, stopRouting } from './status'
import Lazy from './Lazy'

export default class Router extends Component {
  static propTypes = {
    onRoute: PropTypes.func,
    className: PropTypes.string
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
    return { easyRouterDepth: this.depth + 1 }
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

  route (path, params, options) {
    const pages = normalizePath(path, this.depth)
    return route(pages, params, options)
  }

  selectPage (toPageName) {
    const { children } = this.props

    Children.forEach(children, child => {
      const childName = child.props.page
      const isDefaultChild = ('default' in child.props)
      if (childName === toPageName || (!this.toPage && isDefaultChild)) {
        this.toPage = child
      }
    })
  }

  dispatchRouteEvent (params) {
    const { onRoute } = this.props
    if (onRoute) {
      return onRoute({
        target: this,
        fromPage: this.currentPage && this.currentPage.props.page,
        toPage: this.toPage.props.page,
        params,
        preventDefault: stopRouting
      })
    }
  }

  loadPage () {
    if (this.toPage.type === Lazy) {
      this.toPage.props.load()
        .then(loadedPage => (this.toPage = loadedPage))
    }
  }

  routeToPage () {
    if (this.currentPage !== this.toPage) {
      this.currentPage = this.toPage
      this.forceUpdate()
    }
    return this.toPage.props.page
  }

  render () {
    let { className } = this.props

    return (<div className={className}>{this.currentPage || null}</div>)
  }
}
