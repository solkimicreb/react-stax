import React, { PureComponent, Children } from "react";
import PropTypes from "prop-types";
import { path, params } from "../integrations";
import { addExtraProps } from "../utils";
import { registerRouter, releaseRouter, routeFromDepth } from "./core";

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
    element: "div"
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

  startRouting() {
    const { onRoute } = this.props;
    const fromPage = this.state.page;
    const toPage = path[this.depth] || this.props.defaultPage;

    // fill the path with the default page, if the current token is empty
    path[this.depth] = toPage;
    // cleanup ongoing animations and setup new ones for later
    this.cleanupAnimation();
    this.setupAnimation();

    if (onRoute) {
      return onRoute({
        target: this,
        fromPage,
        toPage
      });
    }
  }

  finishRouting(resolvedData) {
    const nextState = {
      resolvedData,
      page: path[this.depth]
    };
    return new Promise(resolve => this.setState(nextState, resolve)).then(() =>
      this.animate()
    );
  }

  setupAnimation() {
    const { leaveAnimation, shouldAnimate } = this.props;
    const fromPage = this.state.page;
    const toPage = path[this.depth];

    this.shouldAnimate =
      shouldAnimate === undefined ? fromPage !== toPage : shouldAnimate;

    if (this.shouldAnimate && leaveAnimation) {
      this.fromDOM = this.container.firstElementChild;
      if (this.fromDOM) {
        this.fromDOM = this.fromDOM.cloneNode(true);
      }
    }
  }

  animate() {
    if (this.shouldAnimate) {
      const { enterAnimation, leaveAnimation } = this.props;
      const fromDOM = this.fromDOM;
      const toDOM = this.container.firstElementChild;

      if (leaveAnimation && fromDOM) {
        this.container.insertBefore(fromDOM, toDOM);
        animate(leaveAnimation, fromDOM).then(() => this.cleanupAnimation());
      }
      // only do an enter animation if there is both a from and to DOM
      // so this is not the initial appearance of the page
      if (enterAnimation && fromDOM && toDOM) {
        animate(enterAnimation, toDOM);
      }
    }
  }

  cleanupAnimation() {
    if (this.fromDOM) {
      this.fromDOM.remove();
      this.fromDOM = undefined;
    }
  }

  render() {
    const { element } = this.props;
    const { page, resolvedData } = this.state;

    let toChild;
    if (React.isValidElement(resolvedData)) {
      toChild = resolvedData;
    } else {
      /// I should probably still clone here to make a fresh child on each render!
      toChild = this.selectChild(page);
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

  saveRef = container => (this.container = container);

  selectChild(page) {
    const children = Children.toArray(this.props.children);
    const selectedChild = children.find(child => child.props.page === page);
    // mounted and has no valid child
    if (!selectedChild && this.container) {
      const { notFoundPage } = this.props;
      return children.find(child => child.props.page === notFoundPage);
    }
    return selectedChild;
  }
}

function animate(options, container) {
  // this is required for Safari and Firefox, but messes up Chrome in some cases
  // options.fill = 'both';
  if (typeof container.animate === "function") {
    if (typeof options === "function") {
      options = options();
    }
    const animation = container.animate(options.keyframes, options);
    return new Promise(resolve => (animation.onfinish = resolve));
  } else {
    console.warn("You should polyfill the webanimation API.");
    return Promise.resolve();
  }
}
