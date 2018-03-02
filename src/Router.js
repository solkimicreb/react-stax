import React, { Component, Children, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { registerRouter, releaseRouter, isRouting } from './core';
import { path, params } from 'react-easy-params';

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

  get depth() {
    return this.context.easyRouterDepth || 0;
  }

  getChildContext() {
    return { easyRouterDepth: this.depth + 1 };
  }

  state = {};

  componentWillUnmount() {
    releaseRouter(this, this.depth);
  }

  componentDidMount() {
    registerRouter(this, this.depth);
    if (!isRouting) {
      this.route(path[this.depth], path[this.depth]);
    }
  }

  route(fromPage, toPage) {
    const startTime = Date.now()

    const defaultPrevented = this.onRoute(fromPage, toPage)
    if (defaultPrevented) {
      throw new Error('Routing prevented')
    }

    const currentView = this.selectPage(toPage)

    return Promise.resolve()
      .then(() => this.resolveData(currentView))
      .then(currentView => this.enter(currentView))

    // not good! this won't rerender with setState in case only the resolved props change
    /*if (!currentView || toPage !== fromPage) {
      routing = routing
        // .then(() => !initial && this.leave())
    }
    return routing*/
  }

  selectPage(toPage) {
    const { children, defaultPage } = this.props
    let currentView = Children.toArray(children).find(
      child => child.props.page === toPage
    )
    if (!currentView) {
      currentView = Children.toArray(children).find(
        child => child.props.page === defaultPage
      )
    }
    return currentView
  }

  onRoute(fromPage, toPage) {
    const { onRoute } = this.props;
    let defaultPrevented = false;

    if (onRoute) {
      onRoute({
        target: this,
        fromPage,
        toPage,
        preventDefault: () => (defaultPrevented = true)
      });
    }
    return defaultPrevented;
  }

  resolveData(currentView) {
    const { resolve, defaultParams } = currentView.props;

    // this does not belong here
    if (defaultParams) {
      for (let key in defaultParams) {
        if (!(key in params)) {
          params[key] = defaultParams[key];
        }
      }
    }

    if (resolve) {
      return Promise.resolve()
        .then(resolve)
        .then(
          data => {
            if (isValidElement(data)) {
              return data
            }
            if (typeof data === 'object') {
              return cloneElement(currentView, data)
            }
            return currentView
          }
      )
    }
    return currentView
  }

  /*leave () {
    const { leaveClass } = this.props;

    if (leaveClass) {
      return new Promise(resolve => {
        this.setState({ statusClass: leaveClass }, resolve);
      });
    }
  }

  waitDuration(startTime) {
    const { duration } = this.props;
    if (duration) {
      const diff = Date.now() - startTime;
      return new Promise(resolve => setTimeout(resolve, duration - diff));
    }
  }*/

  enter(currentView) {
    path[this.depth] = currentView.props.page;

    return new Promise(resolve =>
      this.setState({ currentView }, resolve)
    )
  }

  render() {
    let { className, style } = this.props
    const { currentView } = this.state

    return (
      <div className={className} style={style}>
        {currentView || null}
      </div>
    );
  }
}
