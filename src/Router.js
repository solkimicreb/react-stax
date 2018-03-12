import React, { Component, Children, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { registerRouter, releaseRouter, route } from './core';
import { path, params } from 'react-easy-params';
import { toPathArray, reThrow, defaults } from './urlUtils'

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

  get depth() {
    return this.context.easyRouterDepth || 0;
  }

  getChildContext() {
    return { easyRouterDepth: this.depth + 1 };
  }

  state = {}

  componentWillUnmount() {
    releaseRouter(this, this.depth)
  }

  componentDidMount() {
    registerRouter(this, this.depth)
  }

  route (routeConfig) {
    route(routeConfig, this.depth)
  }

  _route(fromPage, toPage) {
    if (this.routing) {
      this.routing.cancelled = true
    }
    const routing = this.routing = {}

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
    if (routing.cancelled) {
      return Promise.resolve()
    }

    const routingThreads = []
    let pending = true
    let timedOut = false

    if (resolve && timeout) {
      routingThreads.push(
        this.wait(timeout)
          .then(() => !routing.cancelled && pending && this.animate(leaveAnimation, fromPage, toPage))
          .then(() => !routing.cancelled && pending && this.updateState({ toPage, pageResolved: undefined }))
          .then(() => (timedOut = true))
      )
    }

    let resolvedData
    routingThreads.push(
      Promise.resolve()
        .then(() => resolve && resolve())
        .then(data => (resolvedData = data))
        .then(() => !routing.cancelled && !timedOut && this.animate(leaveAnimation, fromPage, toPage))
        .then(
          () => !routing.cancelled && this.updateState({ toPage, pageResolved: true, resolvedData }),
          reThrow(() => !routing.cancelled && this.updateState({ toPage, pageResolved: false }))
        )
        // this won't run in case of errors
        .then(() => (pending = false))
    )

    const routingPromise = Promise.race(routingThreads)
    routingPromise
      .then(() => !routing.cancelled && this.animate(enterAnimation, fromPage, toPage))

    Promise.all(routingThreads)
      .then(() => (this.routing = undefined))

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
  }

  animate ({ keyframes, options } = {}, fromPage, toPage) {
    const currentPage = toPathArray(location.pathname)[this.depth]
    if (keyframes && options && this.routerNode && fromPage && toPage !== fromPage && toPage !== currentPage) {
      const animation = this.routerNode.animate(keyframes, options)
      return new Promise(resolve => animation.onfinish = resolve)
    }
  }

  render() {
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
