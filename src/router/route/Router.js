import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { div, normalizeProps, animate } from 'env';
import { path, params } from '../integrations';
import { log, addExtraProps } from '../utils';
import { registerRouter, releaseRouter, routeFromDepth } from './core';

export default class Router extends PureComponent {
  static propTypes = {
    defaultPage: PropTypes.string.isRequired,
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
    return Promise.resolve()
      .then(() => this.init(toPage))
      .then(toPage => this.resolve(fromPage, toPage, fromParams, status))
      .then(nextState => this.switch(nextState, status));
  }

  init(toPage) {
    const { onRoute, defaultPage } = this.props;
    const toChild = this.selectChild(toPage);
    // if no child found, leave toPage as it is!

    toPage = toChild.props.page;
    path.splice(this.depth, Infinity, toPage);

    // improve this -> also this is only needed if I have a leaveAnimation
    const { firstElementChild } = this.container;
    this.fromDOM = firstElementChild && firstElementChild.cloneNode(true);

    return toPage;
  }

  resolve(fromPage, toPage, fromParams, status) {
    const { onRoute, timeout } = this.props;

    const nextState = {
      toPage,
      resolvedData: undefined,
      pageResolved: undefined
    };

    if (onRoute) {
      const resolveThreads = [];
      let timedout;

      const resolveThread = Promise.resolve()
        .then(() =>
          onRoute({
            target: this,
            fromPage,
            toPage,
            fromParams,
            toParams: params
          })
        )
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

  switch(nextState, status) {
    return Promise.resolve()
      .then(status.check(() => this.updateState(nextState)))
      .then(status.check(() => this.animate()));
  }

  selectChild(toPage) {
    const { children, defaultPage } = this.props;
    let toChild, defaultChild;

    Children.forEach(children, child => {
      if (child.props.page === toPage) {
        toChild = child;
      } else if (child.props.page === defaultPage) {
        defaultChild = child;
      }
    });

    const selectedChild = toChild || defaultChild;
    if (!selectedChild) {
      throw new Error(
        'Routers must have a defaultPage prop and a child with a matching page prop.'
      );
    }
    return selectedChild;
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

  // the other router is reused!!
  render() {
    const { onRoute } = this.props;
    const { toPage, resolvedData, pageResolved } = this.state;

    // if the pages changed I need create a new comp!!
    // also select children with no pages!!
    let toChild;
    if (!toPage) {
      toChild = null;
    } else if (React.isValidElement(resolvedData)) {
      // no need to pass pageResolved here, it would always be true
      toChild = resolvedData;
    } else {
      /// I should probably still clone here to make a fresh child on each render!
      toChild = this.selectChild(toPage);
      if (onRoute) {
        toChild = React.cloneElement(
          toChild,
          Object.assign({ pageResolved }, resolvedData)
        );
      }
    }

    return React.createElement(
      div,
      normalizeProps(
        addExtraProps({ ref: this.saveRef }, this.props, Router.propTypes)
      ),
      toChild
    );
  }
}
