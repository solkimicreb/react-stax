import React, { Component, PropTypes, Children } from 'react'
import { registerRouter, releaseRouter, route, routeInitial } from './core'
import { normalizePath } from './urlUtils'
import Lazy from './Lazy'
import { pages } from './observables'

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

  componentWillUnmount () {
    releaseRouter(this, this.depth)
  }

  componentDidMount () {
    // this.route()
    // this.registerRouter()
    if (this.depth === 0) {
      routeInitial()
    }
  }

  componentWillReceiveProps ({ children }) {
    // this might be bad!
    if (children !== this.props.children) {
      this.parsePages()
    }
  }

  /*route (path, params, options) {
    const pages = normalizePath(path, this.depth)
    return route(pages, params, options)
  }*/

  route (toPage) {
    const { defaultPage } = this.props
    const startTime = Date.now()
    const pagesMap = this.parsePages()
    const fromPage = pages[this.depth]
    toPage = toPage in pagesMap ? toPage : defaultPage

    console.log('toPage', toPage, 'fromPage', fromPage)

    if (toPage !== fromPage) {
      return this.startRouting()
        .then(() => this.dispatchRouteEvent(fromPage, toPage))
        // only continue if it is not defaultPrevented!
        .then(() => this.waitDuration(startTime))
        .then(() => this.endRouting(pagesMap, toPage))
    }
  }

  parsePages () {
    const pages = {}
    Children.forEach(this.props.children, child => {
      pages[child.props.page] = child
    })
    return pages
  }

  startRouting () {
    const { leaveClass } = this.props

    return new Promise(resolve => {
      this.setState({ statusClass: leaveClass }, resolve)
    })
  }

  dispatchRouteEvent (fromPage, toPage) {
    const { onRoute } = this.props

    if (onRoute) {
      return onRoute({
        target: this,
        fromPage,
        toPage,
        preventDefault () {
          this.defaultPrevented = true
        }
      })
    }
  }

  loadPage (pagesMap, toPage) {
    const Page = pagesMap[toPage]
    if (Page.type === Lazy) {
      Page.props.load()
        .then(LoadedPage => (pagesMap[toPage] = LoadedPage))
    }
  }

  waitDuration (startTime) {
    const { duration } = this.props
    if (duration) {
      const diff = Date.now() - startTime
      return new Promise(resolve => setTimeout(resolve, duration - diff))
    }
  }

  endRouting (pagesMap, toPage) {
    const { enterClass } = this.props
    const Page = pagesMap[toPage]
    pages[this.depth] = toPage
    console.log('end')
    return new Promise(resolve => {
      this.setState({ Page, statusClass: enterClass }, resolve)
    })
  }

  render () {
    const { statusClass, Page } = this.state

    const className = `${this.props.className} ${statusClass}`
    return <div className={className}>{Page || null}</div>
  }
}
