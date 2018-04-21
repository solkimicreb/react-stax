import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { div, animate } from 'env';
import { path, params } from '../integrations';
import { log, addExtraProps, noop } from '../utils';
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

  state = { key: 0 };

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

  route2(fromPage, resolvedData) {
    let { shouldAnimate, leaveAnimation } = this.props;
    const toPage = path[this.depth];

    if (typeof shouldAnimate === 'function') {
      shouldAnimate = shouldAnimate();
    }
    if (shouldAnimate === undefined) {
      shouldAnimate = fromPage !== toPage;
    }

    if (this.fromDOM) {
      this.fromDOM.remove();
      this.fromDOM = undefined;
    }

    // issue parent router is keyed
    let key;
    const originalRemoveChild = this.container.removeChild;
    if (shouldAnimate && leaveAnimation) {
      key = this.state.key + 1;
      this.container.removeChild = noop;
      this.fromDOM = this.container.firstElementChild;
    } else {
      // this is also bad ): it should not be keyed!
      // it will change even when it should not
      // or should it really have a key?
      // fixed key if it should not animate
      // I route to the same page in default mode
      // I route to a different page with no animation
      // it will be keyed to be the same as the previous
      key = this.state.key;
    }
    // increment the key if I go to a different page or if I have shouldAnimate true and leaveAnimation

    const nextState = {
      resolvedData,
      toPage,
      key
    };

    return new Promise(resolve => this.setState(nextState, resolve))
      .then(() => (this.container.removeChild = originalRemoveChild))
      .then(() => shouldAnimate && this.animate());
  }

  animate() {
    const { enterAnimation, leaveAnimation } = this.props;
    const fromDOM = this.fromDOM;
    const toDOM = fromDOM && fromDOM.nextElementSibling;

    // only enter animate if this is not the router's first routing
    // (there is a from an to DOM too)
    if (enterAnimation && toDOM) {
      animate(enterAnimation, toDOM);
    }
    if (leaveAnimation && fromDOM) {
      animate(leaveAnimation, fromDOM).then(() => {
        fromDOM.remove();
        this.fromDOM = undefined;
      });
    }
  }

  render() {
    const { element } = this.props;
    const { toPage, resolvedData, key } = this.state;

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
    if (toChild) {
      toChild = React.cloneElement(toChild, { key });
    }

    return React.createElement(
      element,
      addExtraProps({ ref: this.saveRef }, this.props, Router.propTypes),
      toChild
    );
  }

  saveRef = container => (this.container = container);

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
}
