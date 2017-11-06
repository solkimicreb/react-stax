import React, { Component, PropTypes, Children } from 'react'
import { registerRouter, releaseRouter, route, routeInitial } from './core'
import { normalizePath } from './urlUtils'
import { appStores, activePageStores } from './stores'
import { isRouting, stopRouting } from './status'
import Lazy from './Lazy'

export default class Router extends Component {
  static propTypes = {
    onRoute: PropTypes.func,
    className: PropTypes.string,
    enterClass: PropTypes.string,
    leaveClass: PropTypes.string,
    duration: PropTypes.number
  }

  static defaultProps = {
    className: '',
    enterClass: '',
    leaveClass: ''
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

  startRouting (toPageName) {
    const { children, leaveClass } = this.props
    this.startTime = Date.now()

    Children.forEach(children, child => {
      const childName = child.props.page
      const isDefaultChild = ('default' in child.props)
      if (childName === toPageName || (!this.toPage && isDefaultChild)) {
        this.toPage = child
      }
    })

    if (this.toPage !== this.currentPage && leaveClass) {
      this.leaving = true
      this.forceUpdate(() => (this.leaving = false))
    }
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

  waitDuration () {
    const { duration } = this.props
    if (duration) {
      const diff = Date.now() - this.startTime
      return new Promise(resolve => setTimeout(resolve, duration - diff))
    }
  }

  routeToPage () {
    if (this.currentPage !== this.toPage) {
      this.currentPage = this.toPage
      this.entering = true
      this.forceUpdate(() => (this.entering = false))
    }
    return this.toPage.props.page
  }

  render () {
    let { className, enterClass, leaveClass } = this.props
    if (this.entering) {
      className += ` ${enterClass}`
    } else if (this.leaving) {
      className += ` ${leaveClass}`
    }

    return <div className={className}>{this.currentPage || null}</div>
  }
}
