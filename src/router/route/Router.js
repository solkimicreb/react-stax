import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { div, animate } from 'env';
import { path, params } from '../integrations';
import { addExtraProps } from '../utils';
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

  state = {
    key: 0
  };

  componentDidMount() {
    registerRouter(this, this.depth);
  }

  componentWillUnmount() {
    releaseRouter(this, this.depth);
  }

  route({ to, params, options } = {}) {
    routeFromDepth(to, params, options, this.depth);
  }

  startRouting() {
    const { onRoute, leaveAnimation } = this.props;
    const { fromPage } = this.state;
    const toPage = path[this.depth] || this.props.defaultPage;

    // fill the path with the default page, if the current token is empty
    path[this.depth] = toPage;

    if (onRoute) {
      return onRoute({
        target: this,
        fromPage,
        toPage
      });
    }
  }

  finishRouting(resolvedData) {
    let { shouldAnimate, leaveAnimation } = this.props;
    let { key, toPage: fromPage } = this.state;
    const toPage = path[this.depth];
    const pagesMatch = fromPage === toPage;

    if (!pagesMatch) {
      key++;
    }

    if (typeof shouldAnimate === 'function') {
      shouldAnimate = shouldAnimate();
    }
    if (shouldAnimate === undefined) {
      shouldAnimate = !pagesMatch;
    }

    let fromDOM, restoreRemoval;
    if (shouldAnimate && leaveAnimation) {
      fromDOM = this.container.firstElementChild;
      restoreRemoval = preventRemoval(this.container, fromDOM);
    }

    const nextState = {
      resolvedData,
      fromPage,
      toPage,
      key
    };

    return new Promise(resolve =>
      this.setState(nextState, () => {
        restoreRemoval && restoreRemoval();
        if (shouldAnimate) {
          this.animate(fromDOM);
        }
        resolve();
      })
    );
  }

  animate(fromDOM) {
    const { enterAnimation, leaveAnimation } = this.props;
    // only do an enter animation if there is both a from and to DOM
    // so this is not the initial appearance of the page
    const toDOM = fromDOM && fromDOM.nextElementSibling;

    if (leaveAnimation && fromDOM) {
      animate(leaveAnimation, fromDOM).then(() => fromDOM.remove());
    }
    if (enterAnimation && toDOM) {
      animate(enterAnimation, toDOM);
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

function preventRemoval(container, child) {
  const originalRemoveChild = container.removeChild;
  container.removeChild = node => {
    if (node !== child) {
      originalRemoveChild.call(container, node);
    }
  };
  return () => (container.removeChild = originalRemoveChild);
}
