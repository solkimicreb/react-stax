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
    enterAnimation: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    leaveAnimation: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    shouldAnimate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    element: PropTypes.any
  };

  static defaultProps = {
    element: div
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

  componentDidMount() {
    registerRouter(this, this.depth);
  }

  componentWillUnmount() {
    releaseRouter(this, this.depth);
  }

  route({ to, params, options } = {}) {
    routeFromDepth(to, params, options, this.depth);
  }

  route1(fromPage, fromParams) {
    let { onRoute, leaveAnimation, shouldAnimate } = this.props;
    const toPage = path[this.depth] || this.props.defaultPage;

    // fill the path with the default page, if the current token is empty
    path[this.depth] = toPage;

    if (typeof shouldAnimate === 'function') {
      shouldAnimate = shouldAnimate();
    }
    if (shouldAnimate === undefined) {
      shouldAnimate = fromPage !== path[this.depth];
    }

    if (this.fromDOM) {
      this.fromDOM.remove();
      this.fromDOM = undefined;
    }
    if (shouldAnimate && leaveAnimation) {
      const { firstElementChild } = this.container;
      this.fromDOM = firstElementChild && firstElementChild.cloneNode(true);
    }

    let result = Promise.resolve();

    if (onRoute) {
      result = result.then(() =>
        onRoute({
          target: this,
          fromPage,
          toPage: path[this.depth],
          fromParams,
          toParams: params
        })
      );
    }

    return result.then(resolvedData => ({
      resolvedData,
      toPage,
      shouldAnimate
    }));
  }

  route2({ resolvedData, toPage, shouldAnimate }) {
    const nextState = {
      resolvedData,
      toPage
    };

    return new Promise(resolve => this.setState(nextState, resolve)).then(
      shouldAnimate && this.animate()
    );
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

  saveRef = container => (this.container = container);

  animate() {
    let { enterAnimation, leaveAnimation } = this.props;
    const fromDOM = this.fromDOM;
    const toDOM = this.container.firstElementChild;

    // only enter animate if this is not the router's first routing
    if (enterAnimation && fromDOM && toDOM) {
      animate(enterAnimation, toDOM);
    }
    if (leaveAnimation && fromDOM) {
      this.container.appendChild(fromDOM);
      animate(leaveAnimation, fromDOM).then(() => {
        fromDOM.remove();
        this.fromDOM = undefined;
      });
    }
  }

  render() {
    const { element } = this.props;
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

    return React.createElement(
      element,
      addExtraProps({ ref: this.saveRef }, this.props, Router.propTypes),
      toChild
    );
  }
}
