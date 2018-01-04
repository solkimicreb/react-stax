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

  state = {}

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
    const { defaultPage, leaveClass } = this.props
    this.startTime = Date.now()

    this.toPage = toPage in this.pages ? toPage : defaultPage

    if (this.toPage !== this.currentPage && leaveClass) {
      return new Promise(resolve => {
        this.setState({ statusClass: leaveClass }, resolve)
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
    const { enterClass } = this.props
    this.currentPage = this.toPage
    const Page = this.pages[this.currentPage]
    return new Promise(resolve => {
      this.setState({ Page, statusClass: enterClass }, resolve)
    })
  }

  render () {
    let { className } = this.props
    const { statusClass, Page } = this.state
    className = `${className} ${statusClass}`

    return <div className={className}>{Page || null}</div>
  }
}
