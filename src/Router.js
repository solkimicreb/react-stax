import React, { Component, Children, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { registerRouter, releaseRouter } from './core';
import { path, params } from 'react-easy-params';

export default class Router extends Component {
  static propTypes = {
    onRoute: PropTypes.func,
    className: PropTypes.string,
    timeout: PropTypes.number
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

  state = {};

  componentWillUnmount() {
    releaseRouter(this, this.depth)
  }

  componentDidMount() {
    registerRouter(this, this.depth)
  }

  route(fromPage, toPage) {
    const { timeout } = this.props
    const currentView = this.selectPage(toPage)
    // do not do this for slave routers
    path[this.depth] = currentView.props.page
    this.setDefaultParams(currentView)

    let pending = true
    if (timeout) {
      this.wait(timeout)
        .then(() => pending && this.enter(this.addLoader(currentView)))
    }

    return this.resolveData(currentView)
      .then(currentView => this.enter(currentView))
      .then(() => (pending = false))
  }

  setDefaultParams (currentView) {
    const { defaultParams } = currentView.props
    if (defaultParams) {
      for (let key in defaultParams) {
        if (params[key] === undefined) {
          params[key] = defaultParams[key]
        }
      }
    }
  }

  selectPage(toPage) {
    const { children, defaultPage } = this.props
    let toView, defaultView

    Children.forEach(children, child => {
      if (child.props.page === toPage) {
        toView = child
      } else if (child.props.page === defaultPage) {
        defaultView === child
      }
    })
    return toView || defaultView
  }

  onRoute (fromPage, toPage) {
    const { onRoute } = this.props;
    let defaultPrevented = false;

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

  resolveData (currentView) {
    const { resolve } = currentView.props

    if (resolve) {
      return Promise.resolve()
        .then(resolve)
        .then(data => this.handleResolvedData(data, currentView))
    }
    return Promise.resolve(currentView)
  }

  handleResolvedData (data, currentView) {
    if (isValidElement(data)) {
      return data
    }
    if (typeof data === 'object') {
      return cloneElement(currentView, data)
    }
    return currentView
  }

  addLoader (currentView) {
    console.log('add loader')
    // only if it has no isLoading prop I guess
    return cloneElement(currentView, { isLoading: true })
  }

  wait (duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
  }

  enter (currentView) {
    return new Promise(resolve => this.setState({ currentView }, resolve))
  }

  render() {
    const { className, style } = this.props
    const { currentView } = this.state

    return (
      <div className={className} style={style}>
        {currentView || null}
      </div>
    )
  }
}
