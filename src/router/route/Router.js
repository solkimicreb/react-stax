import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { div, normalizeProps, animate } from 'env';
import { path, params } from '../integrations';
import { defaults, log } from '../utils';
import { registerRouter, releaseRouter, routeFromDepth } from './core';

export default class Router extends PureComponent {
  static propTypes = {
    defaultPage: PropTypes.string.isRequired,
    onRoute: PropTypes.func,
    enterAnimation: PropTypes.object,
    leaveAnimation: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static childContextTypes = { easyRouterDepth: PropTypes.number };
  static contextTypes = { easyRouterDepth: PropTypes.number };

  getChildContext() {
    return { easyRouterDepth: this.depth + 1 };
  }

  get depth() {
    return this.context.easyRouterDepth || 0;
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

  init(fromPage, toPage, fromParams) {
    const toChild = this.selectChild(toPage);
    const { onRoute, defaultPage } = this.props;
    const { defaultParams } = toChild.props;
    toPage = toChild.props.page;

    path.splice(this.depth, Infinity, toPage);
    if (defaultParams) {
      defaults(params, defaultParams);
    }

    if (!onRoute) {
      return Promise.resolve(toChild);
    }

    return Promise.resolve()
      .then(() =>
        onRoute({
          target: this,
          fromPage,
          toPage,
          fromParams,
          toParams: params,
          preventDefault: fallback =>
            this.route(
              fromPage === toPage
                ? fallback || { to: defaultPage }
                : { to: fromPage, params: fromParams }
            )
        })
      )
      .then(() => toChild);
  }

  resolve(toChild, status) {
    const { resolve, timeout, page: toPage } = toChild.props;
    const nextState = {
      toPage,
      resolvedData: undefined,
      pageResolved: undefined
    };

    this.fromDOM =
      this.container &&
      this.container.firstElementChild &&
      this.container.firstElementChild.cloneNode(true);

    if (resolve) {
      const resolveThreads = [];
      let timedout;

      const resolveThread = Promise.resolve()
        .then(() => resolve(toChild.props))
        .then(
          resolvedData =>
            Object.assign(nextState, { resolvedData, pageResolved: true }),
          log(() => Object.assign(nextState, { pageResolved: false }))
        );

      // TODO: check this to always work as expected!
      resolveThread.then(
        status.check(() => timedout && this.updateState(nextState))
      );
      resolveThreads.push(resolveThread);

      if (timeout) {
        resolveThreads.push(
          new Promise(resolve => setTimeout(resolve, timeout)).then(
            () => (timedout = true)
          )
        );
      }

      return Promise.race(resolveThreads).then(() => nextState);
    }
    return nextState;
  }

  switch(nextState, status, options, initial) {
    const { enterAnimation, leaveAnimation } = this.props;
    const { toPage: fromPage } = this.state;
    const { toPage } = nextState;

    const { fromDOM } = this;

    return Promise.resolve()
      .then(status.check(() => this.updateState(nextState)))
      .then(() => {
        fromDOM && this.container.appendChild(fromDOM);
      })
      .then(
        status.check(() => {
          this.animate(
            enterAnimation,
            fromPage,
            toPage,
            options,
            initial,
            this.container && this.container.firstElementChild
          );
          return this.animate(
            leaveAnimation,
            fromPage,
            toPage,
            options,
            initial,
            fromDOM
          );
        })
      )
      .then(() => {
        fromDOM && this.container.removeChild(fromDOM);
      });
  }

  selectChild(toPage) {
    const { children, defaultPage } = this.props;
    let toChild, defaultChild;

    // if nothing matches!! add a warning -> there is a defaultPage but it matches with no children

    Children.forEach(children, child => {
      if (child.props.page === toPage) {
        toChild = child;
      } else if (child.props.page === defaultPage) {
        defaultChild = child;
      }
    });
    return toChild || defaultChild;
  }

  updateState(nextState) {
    return new Promise(resolve => this.setState(nextState, resolve));
  }

  saveRef = container => (this.container = container);

  animate(animation, fromPage, toPage, options, initial, container) {
    // check if there was an element before
    const canAnimate = animation && initial;
    const shouldAnimate =
      options.animate !== false && (options.animate || fromPage !== toPage);
    if (canAnimate && shouldAnimate) {
      return animate(animation, container);
    }
  }

  // the other router is reused!!
  render() {
    const { className, style } = this.props;
    const { toPage, resolvedData, pageResolved } = this.state;

    // if the pages changed I need create a new comp!!
    let toChild;
    if (!toPage) {
      toChild = null;
    } else if (React.isValidElement(resolvedData)) {
      // no need to pass pageResolved here, it would always be true
      toChild = resolvedData;
    } else {
      /// I should probably still clone here to make a fresh child on each render!
      toChild = this.selectChild(toPage);
      if (toChild.props.resolve) {
        toChild = React.cloneElement(
          this.selectChild(toPage),
          Object.assign({}, { pageResolved }, resolvedData)
        );
      }
    }

    return React.createElement(
      div,
      normalizeProps({ className, style, ref: this.saveRef }),
      toChild
    );
  }
}
