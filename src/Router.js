import React, { Component, PropTypes, Children } from 'react'
import { registerRouter, releaseRouter, route, routeInitial } from './core'
import { normalizePath } from './urlUtils'
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
    this.parsePages()
  }

  componentDidMount () {
    if (this.depth === 0) {
      routeInitial()
    }
  }

  componentWillUnmount () {
    releaseRouter(this, this.depth)
  }

  componentWillReceiveProps ({ children }) {
    // this might be bad!
    if (children !== this.props.children) {
      this.parsePages()
    }
  }

  parsePages () {
    const { children } = this.props
    const pages = {}
    Children.forEach(children, child => {
      const page = child.props.page
      pages[page] = child
    })
    this.pages = pages
  }

  route (path, params, options) {
    const pages = normalizePath(path, this.depth)
    return route(pages, params, options)
  }

  startRouting (toPage) {
    return Promise.resolve()
      .then(() => this.selectPage(toPage))
      .then(() => this.dispatchRouteEvent())
  }

  selectPage (toPage) {
    const { leaveClass, defaultPage, notFoundPage } = this.props
    this.startTime = Date.now()

    if (toPage in this.pages) {
      this.toPage = toPage
    } else if (toPage) {
      this.toPage = notFoundPage
    } else {
      this.toPage = defaultPage
    }

    if (this.toPage !== this.currentPage && leaveClass) {
      this.leaving = true
      return new Promise(resolve => {
        // use the renderIndicator trick here!!
        this.setState({}, () => {
          this.leaving = false
          resolve()
        })
      })
    }
  }

  dispatchRouteEvent () {
    const { onRoute } = this.props
    const event = {
      target: this,
      fromPage: this.currentPage,
      toPage: this.toPage,
      preventDefault () {
        this.defaultPrevented = true
      }
    }

    return onRoute
      ? onRoute(event).then(() => event)
      : event
  }

  finishRouting () {
    if (this.toPage !== this.currentPage) {
      return Promise.resolve()
        .then(() => this.loadPage())
        .then(() => this.waitDuration())
        .then(() => this.routeToPage())
    }
  }

  loadPage () {
    const { pages, toPage } = this
    const Page = pages[toPage]
    if (Page.type === Lazy) {
      Page.props.load()
        .then(LoadedPage => (pages[toPage] = LoadedPage))
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
    this.currentPage = this.toPage
    this.entering = true
    return new Promise(resolve => {
      this.setState({}, () => {
        this.entering = false
        resolve()
      })
    })
  }

  render () {
    const { entering, leaving, pages, currentPage } = this
    let { className, enterClass, leaveClass } = this.props

    if (entering) {
      className += ` ${enterClass}`
    } else if (leaving) {
      className += ` ${leaveClass}`
    }

    const Page = pages[currentPage] || null
    return <div className={className}>{Page}</div>
  }
}
