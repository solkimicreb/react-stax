import React, { Component, Children, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { registerRouter, releaseRouter } from './core';
import { path, params } from 'react-easy-params';

export default class Router extends Component {
  static propTypes = {
    onRoute: PropTypes.func,
    defaultPage: PropTypes.string.isRequired,
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

    console.log(currentView, toPage)
    path[this.depth] = currentView.props.page
    this.setDefaultParams(currentView)

    console.log('props', this.props)

    let pending = true
    if (timeout) {
      this.wait(timeout)
        .then(() => pending && this.enter(currentView, 'pending'))
    }

    return this.resolveData(currentView)
      .then(
        currentView => this.enter(currentView, 'fulfilled'),
        () => this.enter(currentView, 'rejected')
      )
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
        defaultView = child
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

  wait (duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
  }

  enter (currentView, pageStatus) {
    currentView = cloneElement(currentView, { pageStatus })
    return new Promise(resolve => this.setState({ currentView }, resolve))
  }

  // maybe set the needed params to the currentView in case of componentWillReceiveProps
  // to allow custom props on children

  // issue -> if children (like child props) change -> it renders out the same exact view ):
  // bad!!
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
