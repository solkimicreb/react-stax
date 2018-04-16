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
    const { onRoute, leaveAnimation } = this.props;

    // fill the path with the default page
    if (!path[this.depth]) {
      path[this.depth] = this.props.defaultPage;
    }

    // FIX THIS, check all ongoing animations and cancel them instead!!
    /*if (this.fromDOM) {
      this.fromDOM.remove();
    }*/
    if (leaveAnimation) {
      this.fromDOM = this.container.firstElementChild;
    }

    if (onRoute) {
      return onRoute({
        target: this,
        fromPage,
        toPage: path[this.depth],
        fromParams,
        toParams: params
      });
    }
  }

  route2(fromPage, resolvedData) {
    const nextState = {
      resolvedData,
      toPage: path[this.depth]
    };

    return new Promise(resolve => this.setState(nextState, resolve)).then(
      this.animate(fromPage)
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

  animate(fromPage) {
    let { enterAnimation, leaveAnimation, shouldAnimate } = this.props;
    let fromDOM = this.fromDOM;
    const toDOM = this.container.firstElementChild;

    if (typeof shouldAnimate === 'function') {
      shouldAnimate = shouldAnimate();
    }
    if (shouldAnimate === undefined) {
      shouldAnimate = fromPage !== path[this.depth];
    }

    // ISSUE: it doesn't even work without the animations!!
    // issue: every depth animates in case of nested routing
    if (shouldAnimate) {
      // only enter animate if this is not the router's first routing
      if (enterAnimation && fromDOM && toDOM) {
        animate(enterAnimation, toDOM);
      }
      if (leaveAnimation && fromDOM) {
        // clone it if the current page did not change
        if (fromDOM === toDOM) {
          this.fromDOM = fromDOM = fromDOM.cloneNode(true);
        }
        this.container.appendChild(fromDOM);
        animate(leaveAnimation, fromDOM).then(() => {
          fromDOM.remove();
          this.fromDOM = undefined;
        });
      }
    }
  }

  render() {
    const { onRoute, element } = this.props;
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
