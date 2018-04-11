import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { div, animate } from 'env';
import { path, params } from '../integrations';
import { log, addExtraProps } from '../utils';
import { registerRouter, releaseRouter, routeFromDepth } from './core';

export default class Router extends PureComponent {
  static propTypes = {
    defaultPage: PropTypes.string,
    notFoundPage: PropTypes.string,
    onRoute: PropTypes.func,
    enterAnimation: PropTypes.object,
    leaveAnimation: PropTypes.object
  };

  static childContextTypes = { easyRouterDepth: PropTypes.number };
  static contextTypes = { easyRouterDepth: PropTypes.number };

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
  }

  route({ to, params, options } = {}) {
    routeFromDepth(to, params, options, this.depth);
  }

  update(fromPage, toPage, fromParams, status) {
    const { firstElementChild } = this.container;
    this.fromDOM = firstElementChild && firstElementChild.cloneNode(true);

    toPage = toPage || this.props.defaultPage;

    return Promise.resolve()
      .then(() => this.resolve(fromPage, toPage, fromParams, status))
      .then(resolvedData => this.switch({ toPage, resolvedData }, status));
  }

  resolve(fromPage, toPage, fromParams) {
    const { onRoute } = this.props;

    if (onRoute) {
      return onRoute({
        target: this,
        fromPage,
        toPage,
        fromParams,
        toParams: params
      });
    }
  }

  switch(nextState, status) {
    this.updatePath(nextState);

    // maybe I don't need a check for the first one
    return Promise.resolve()
      .then(status.check(() => this.updateState(nextState)))
      .then(status.check(() => this.animate()));
  }

  selectChild(toPage) {
    const { notFoundPage } = this.props;
    const children = Children.toArray(this.props.children);

    const toChild = children.find(child => child.props.page === toPage);
    // mounted and has no child
    if (!toChild && this.container) {
      return children.find(child => child.props.page === notFoundPage);
    }
    return toChild;
  }

  updateState(nextState) {
    return new Promise(resolve => this.setState(nextState, resolve));
  }

  saveRef = container => (this.container = container);

  animate() {
    const { enterAnimation, leaveAnimation } = this.props;
    const fromDOM = this.fromDOM;
    const toDOM = this.container.firstElementChild;

    // use the animate prop here to decide when to animate
    if (fromDOM && toDOM) {
      if (enterAnimation) {
        animate(enterAnimation, toDOM);
      }
      if (leaveAnimation) {
        this.container.appendChild(fromDOM);
        animate(leaveAnimation, fromDOM).then(() => {
          this.container.removeChild(fromDOM);
          this.fromDOM = undefined;
        });
      }
    }
  }

  updatePath({ toPage, resolvedData }) {
    const toChild = React.isValidElement(resolvedData)
      ? resolvedData
      : this.selectChild(toPage);

    if (toChild) {
      const { page } = toChild.props;
      if (!page) {
        throw new Error('Router children must have a page property.');
      }
      path[this.depth] = page;
    }
  }

  render() {
    const { onRoute } = this.props;
    const { toPage, resolvedData } = this.state;

    let toChild;
    if (React.isValidElement(resolvedData)) {
      toChild = resolvedData;
    } else {
      /// I should probably still clone here to make a fresh child on each render!
      toChild = this.selectChild(toPage);
      if (toChild && resolvedData) {
        toChild = React.cloneElement(toChild, resolvedData);
      }
    }

    // on the very first render it displays a not found page!! -> bad!

    return React.createElement(
      div,
      addExtraProps({ ref: this.saveRef }, this.props, Router.propTypes),
      toChild
    );
  }
}
