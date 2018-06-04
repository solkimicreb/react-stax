import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { path, params, elements, animation } from './integrations';
import { addExtraProps } from './utils';
import { registerRouter, releaseRouter, routeFromDepth } from './core';

// Router selects a single child to render based on its children's page props
// and the URL pathname token at the Router's depth (they can be nested)
export default class Router extends PureComponent {
  static propTypes = {
    defaultPage: PropTypes.string,
    notFoundPage: PropTypes.string,
    onRoute: PropTypes.func,
    enterAnimation: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    leaveAnimation: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    shouldAnimate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    element: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  };

  static defaultProps = {
    element: elements.div
  };

  static childContextTypes = { easyRouterDepth: PropTypes.number };
  static contextTypes = { easyRouterDepth: PropTypes.number };

  getChildContext() {
    return { easyRouterDepth: this.depth + 1 };
  }

  // depth stores how nested is the router, root routers have a depth of 0
  get depth() {
    return this.context.easyRouterDepth || 0;
  }

  state = {};

  componentDidMount() {
    registerRouter(this, this.depth);
  }

  componentWillUnmount() {
    releaseRouter(this, this.depth);
  }

  // the raw DOM container node is needed for the animations
  saveContainer = container => (this.container = container);

  // this is part of the public API
  // it routes every router from this depth (including this one)
  route(routingOptions) {
    routeFromDepth(routingOptions, this.depth);
  }

  // routing is split in 2 phases
  // first all parallel routers at the same depth executes startRouting
  // then all parallel routers at the same depth execute finishRouting
  startRouting() {
    const { onRoute } = this.props;
    const fromPage = this.state.page;
    const toPage = path[this.depth] || this.props.defaultPage;

    // fill the path with the default page, if the current path token is empty
    // this is important for relative links and automatic active link highlight
    path[this.depth] = toPage;

    // this saves the current raw view (DOM) to be used for the leave animation
    // it is important to call this here, before anything could mutate the view
    // the first thing which may mutate views is the props.onRoute call below
    // mutations should only happen to the new view after the routing started
    this.setupAnimation();

    // onRoute is where do user can intercept the routing or resolve data
    if (onRoute) {
      return onRoute({
        target: this,
        fromPage,
        toPage
      });
    }
  }

  // finishRouting is called when all parallel routers at the current depth
  // finished executing startRouting
  // resolvedData is the data returned from props.onRoute in startRouting
  finishRouting(resolvedData) {
    const nextState = {
      resolvedData,
      page: path[this.depth]
    };
    // render the new page with the resolvedData
    return new Promise(resolve => this.setState(nextState, resolve)).then(
      () => {
        // do not deal with animations when running in NodeJS
        // run the animations when the new page is fully rendered
        this.animate();
        // the router has done at least one full routing
        this.inited = true;
      }
    );
  }

  setupAnimation() {
    const { leaveAnimation, shouldAnimate } = this.props;
    const fromPage = this.state.page;
    const toPage = path[this.depth];

    // only animate when a new page is rendered by default,
    // but make it configurable with the shouldAnimate prop
    // the user may also want to animate when a query param changes for example
    if (typeof shouldAnimate === 'function') {
      this.shouldAnimate = shouldAnimate({ fromPage, toPage });
    } else {
      this.shouldAnimate =
        shouldAnimate === undefined ? fromPage !== toPage : shouldAnimate;
    }

    // if there will be a leaveAnimation during the current routing
    // save the current raw view (DOM), so it can be used later for a fade out
    // or cross fade effect after the new view is rendered
    if (this.shouldAnimate && leaveAnimation) {
      animation.setup(this.container);
    }
  }

  animate() {
    const { enterAnimation, leaveAnimation } = this.props;

    if (this.shouldAnimate) {
      // only do an enter animation if this is not the initial routing of the router
      // this prevents cascading over-animation, in case of nested routers
      // only the outmost one will animate, the rest will appear normally
      if (enterAnimation && this.inited) {
        animation.enter(this.container, enterAnimation);
      }
      // DO NOT return the promise from animateElement()
      // there is no need to wait for the animation,
      // the views may be hidden by the animation, but the DOM routing is already over
      // it is safe to go on with routing the next level of routers
      // LEAVE MUST COME AFTER ENTER!
      if (leaveAnimation) {
        animation.leave(this.container, leaveAnimation);
      }
    }
  }

  render() {
    const { element } = this.props;
    const { page, resolvedData } = this.state;

    // render nothing if no matching view is found
    let toChild = null;
    // if the resolvedData from onRoute is a React element use it as the view
    // this allows lazy loading components (and virtual routing)
    if (React.isValidElement(resolvedData)) {
      toChild = resolvedData;
    } else {
      // select the next child based on the children's page prop
      // and the string token in the URL pathname at the routers depth
      toChild = this.selectChild(page);
      if (toChild && resolvedData) {
        // of there is resolvedData from onRoute, inject it as props to the next view
        toChild = React.cloneElement(toChild, resolvedData);
      }
    }

    return React.createElement(
      element,
      // forward none Router specific props to the underlying DOM element
      addExtraProps({ ref: this.saveContainer }, this.props, Router.propTypes),
      // render the selected child as the only child element
      toChild
    );
  }

  // select the next view based on the children's page prop
  // and the string token in the URL pathname at the routers depth
  selectChild(page) {
    const children = Children.toArray(this.props.children);
    const selectedChild = children.find(child => child.props.page === page);
    // if the router is mounted and it has no matching child view,
    // try to render a notFoundPage
    // if the router is not yet mounted, the initial routing is not yet finished
    // in this case it should render nothing (null), instead of a notFoundPage
    if (!selectedChild && this.container) {
      const { notFoundPage } = this.props;
      return children.find(child => child.props.page === notFoundPage);
    }
    return selectedChild;
  }
}
