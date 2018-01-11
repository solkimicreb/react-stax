import React, { Component, PropTypes, Children } from 'react'
import { registerRouter, releaseRouter, route, isRouting } from './core'
import { path } from './observables'
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
  }

  componentWillUnmount () {
    releaseRouter(this, this.depth)
  }

  componentDidMount () {
    this.route(path[this.depth], path[this.depth])
  }

  route (fromPage, toPage) {
    const { currentView } = this.state
    const startTime = Date.now()
    toPage = this.selectPage(toPage)

    const defaultPrevented = this.onChange(fromPage, toPage)
    if (defaultPrevented) {
      throw new Error('Routing prevented')
    }

    if (!currentView || toPage !== fromPage) {
      return Promise.resolve()
        .then(() => this.startRouting())
        .then(() => this.selectView(toPage))
        .then(() => this.resolveData())
        .then(() => this.waitDuration(startTime))
        .then(() => this.updateView())
        .then(() => this.finishRouting(toPage))
    }

    // refactor this
    return toPage
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

  onChange (fromPage, toPage) {
    const { onChange } = this.props
    let defaultPrevented = false

    if (onChange) {
      onChange({
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
    const view = Children.toArray(children)
      .find(child => child.props.page === toPage)

    this.currentView = view.type === Lazy ? view.props.load() : view
  }

  resolveData () {
    const { resolve } = this.currentView.props

    // I should clone the view with the new props from resolve!
    if (resolve) {
      return resolve()
    }
  }

  waitDuration (startTime) {
    const { duration } = this.props
    if (duration) {
      const diff = Date.now() - startTime
      return new Promise(resolve => setTimeout(resolve, duration - diff))
    }
  }

  updateView () {
    const { enterClass } = this.props
    const { currentView } = this

    return new Promise(resolve => {
      this.setState({ currentView, statusClass: enterClass }, resolve)
    })
  }

  finishRouting (toPage) {
    this.currentView = undefined
    return toPage
  }

  render () {
    let { className } = this.props
    const { statusClass, currentView } = this.state
    
    className = `${className} ${statusClass}`
    return <div className={className}>{currentView || null}</div>
  }
}
