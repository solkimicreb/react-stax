import React, { Component, PropTypes, Children, cloneElement } from 'react'
import { registerRouter, releaseRouter, isRouting } from './core'
import { path, params } from './observables'
import Lazy from './Lazy'

export default class Router extends Component {
  static propTypes = {
    onRoute: PropTypes.func,
    alwaysRoute: PropTypes.bool,
    className: PropTypes.string,
    enterClass: PropTypes.string,
    leaveClass: PropTypes.string,
    duration: PropTypes.number
  };

  static defaultProps = {
    alwaysRoute: false,
    className: '',
    enterClass: '',
    leaveClass: ''
  };

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

  state = {};

  componentWillMount () {
    registerRouter(this, this.depth)
  }

  componentWillUnmount () {
    releaseRouter(this, this.depth)
  }

  componentDidMount () {
    if (!isRouting) {
      this.route(path[this.depth], path[this.depth])
    }
  }

  route (fromPage, toPage, initial) {
    const { alwaysRoute } = this.props
    const { currentView } = this.state
    const startTime = Date.now()
    toPage = this.selectPage(toPage)

    if (alwaysRoute || !currentView || toPage !== fromPage) {
      const defaultPrevented = this.onRoute(fromPage, toPage)
      if (defaultPrevented) {
        throw new Error('Routing prevented')
      }

      return Promise.resolve()
        .then(() => initial && this.startRouting())
        .then(() => initial && alwaysRoute && this.waitDuration(startTime))
        .then(() => this.selectView(toPage))
        .then(() => this.resolveData())
        .then(() => initial && !alwaysRoute && this.waitDuration(startTime))
        .then(() => this.finishRouting(toPage))
    }
  }

  selectPage (toPage) {
    const { children, defaultPage } = this.props
    const pages = Children.map(children, child => child.props.page)
    return pages.indexOf(toPage) === -1 ? defaultPage : toPage
  }

  startRouting () {
    const { leaveClass } = this.props

    if (leaveClass) {
      return new Promise(resolve => {
        this.setState({ statusClass: leaveClass }, resolve)
      })
    }
  }

  onRoute (fromPage, toPage) {
    const { onRoute } = this.props
    let defaultPrevented = false

    if (onRoute) {
      onRoute({
        target: this,
        fromPage,
        toPage,
        preventDefault: () => (defaultPrevented = true)
      })
    }
    return defaultPrevented
  }

  selectView (toPage) {
    const { children } = this.props
    const view = Children.toArray(children).find(
      child => child.props.page === toPage
    )

    this.currentView = view.type === Lazy ? view.props.load() : view
  }

  resolveData () {
    const { resolve, defaultParams } = this.currentView.props

    if (defaultParams) {
      for (let key in defaultParams) {
        if (!(key in params)) {
          params[key] = defaultParams[key]
        }
      }
    }

    if (resolve) {
      return (
        resolve()
          // BAD -> not guaranteed to be a promise
          .then(
            data => (this.currentView = cloneElement(this.currentView, data))
          )
      )
    }
  }

  waitDuration (startTime) {
    const { duration } = this.props
    if (duration) {
      const diff = Date.now() - startTime
      return new Promise(resolve => setTimeout(resolve, duration - diff))
    }
  }

  finishRouting (toPage) {
    const { enterClass } = this.props
    const { currentView } = this

    path[this.depth] = toPage
    this.currentView = undefined

    return new Promise(resolve => {
      this.setState({ currentView, statusClass: enterClass }, resolve)
    })
  }

  render () {
    let { className } = this.props
    const { statusClass, currentView } = this.state

    className = `${className} ${statusClass}`
    return <div className={className}>{currentView || null}</div>
  }
}
