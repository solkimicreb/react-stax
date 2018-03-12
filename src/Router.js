import React, {
  Component,
  Children,
  isValidElement,
  cloneElement
} from 'react'
import PropTypes from 'prop-types'
import { registerRouter, releaseRouter, routeFromDepth } from './core'
import { path, params } from 'react-easy-params'
import { toPathArray, reThrow, defaults, RoutingStatus } from './urlUtils'

export default class Router extends Component {
  static propTypes = {
    defaultPage: PropTypes.string.isRequired,
    onRoute: PropTypes.func,
    className: PropTypes.string,
    enterAnimation: PropTypes.object,
    leaveAnimation: PropTypes.object
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

  componentWillUnmount () {
    releaseRouter(this, this.depth)
  }

  componentDidMount () {
    registerRouter(this, this.depth)
  }

  route ({ to, params, options } = {}) {
    routeFromDepth(to, params, options, this.depth)
  }

  switch (fromPage, toPage) {
    if (this.routingStatus) {
      this.routingStatus.cancelled = true
    }
    const status = (this.routingStatus = new RoutingStatus())

    const { enterAnimation, leaveAnimation } = this.props
    const toChild = this.selectChild(toPage)
    const { resolve, timeout, page, defaultParams } = toChild.props
    // name this better
    toPage = page

    path.splice(this.depth, Infinity, toPage)
    if (defaultParams) {
      defaults(params, defaultParams)
    }

    this.onRoute(fromPage, toPage)
    // maybe I do not need this check!, only needed because onRoute can cancel the routing
    if (status.cancelled) {
      return Promise.resolve()
    }

    const routingThreads = []
    let pending = true
    let timedOut = false

    if (resolve && timeout) {
      routingThreads.push(
        this.wait(timeout)
          .then(
            status.check(
              () => this.animate(leaveAnimation, fromPage, toPage),
              'resolved',
              'cancelled'
            )
          )
          .then(
            status.check(
              () => this.updateState({ toPage, pageResolved: undefined }),
              'resolved',
              'cancelled'
            )
          )
          .then(() => (status.timedout = true))
      )
    }

    let resolvedData
    routingThreads.push(
      Promise.resolve()
        .then(() => resolve && resolve())
        .then(data => (resolvedData = data))
        .then(
          status.check(
            () => this.animate(leaveAnimation, fromPage, toPage),
            'timedout',
            'cancelled'
          )
        )
        .then(
          // make these general later
          status.check(
            () =>
              this.updateState({ toPage, pageResolved: true, resolvedData }),
            'cancelled'
          ),
          reThrow(
            status.check(
              () => this.updateState({ toPage, pageResolved: false }),
              'cancelled'
            )
          )
        )
        // this won't run in case of errors
        .then(() => (status.resolved = true))
    )

    const routingPromise = Promise.race(routingThreads)
    routingPromise.then(
      status.check(
        () => this.animate(enterAnimation, fromPage, toPage),
        'cancelled'
      )
    )

    Promise.all(routingThreads).then(() => (this.routingStatus = undefined))

    return routingPromise
  }

  selectChild (toPage) {
    const { children, defaultPage } = this.props
    let toChild, defaultChild

    Children.forEach(children, child => {
      if (child.props.page === toPage) {
        toChild = child
      } else if (child.props.page === defaultPage) {
        defaultChild = child
      }
    })
    return toChild || defaultChild
  }

  onRoute (fromPage, toPage) {
    const { onRoute } = this.props

    if (onRoute) {
      onRoute({
        target: this,
        fromPage,
        toPage
      })
    }
  }

  wait (duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
  }

  updateState (state) {
    return new Promise(resolve => this.setState(state, resolve))
  }

  saveRef = routerNode => {
    this.routerNode = routerNode
  };

  animate ({ keyframes, options } = {}, fromPage, toPage) {
    const currentPage = toPathArray(location.pathname)[this.depth]
    if (
      keyframes &&
      options &&
      this.routerNode &&
      fromPage &&
      toPage !== fromPage &&
      toPage !== currentPage
    ) {
      const animation = this.routerNode.animate(keyframes, options)
      return new Promise(resolve => (animation.onfinish = resolve))
    }
  }

  render () {
    const { className, style } = this.props
    const { toPage, resolvedData, pageResolved } = this.state

    let toChild
    if (!toPage) {
      toChild = null
    } else if (isValidElement(resolvedData)) {
      // no need to pass pageResolved here, it would always be true
      toChild = resolvedData
    } else {
      toChild = this.selectChild(toPage)
      if (toChild.props.resolve) {
        toChild = cloneElement(
          this.selectChild(toPage),
          Object.assign({}, { pageResolved }, resolvedData)
        )
      }
    }

    return (
      <div className={className} style={style} ref={this.saveRef}>
        {toChild}
      </div>
    )
  }
}
