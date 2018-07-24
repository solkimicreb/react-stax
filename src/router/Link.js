import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observe, unobserve } from '@nx-js/observer-util';
import { routeFromDepth } from './core';
import { toUrl, normalizePath, addExtraProps } from './utils';
import { params, path, history, elements } from './integrations';
import { state as scheduler } from '../schedulers';

// Link is used to navigate between pages
// it can be relative ('home') or absolute ('/home'), just like vanilla HTML links
export default class Link extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    params: PropTypes.object,
    scroll: PropTypes.object,
    push: PropTypes.bool,
    inherit: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    activeClass: PropTypes.string,
    activeStyle: PropTypes.object,
    isActive: PropTypes.func,
    element: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  };

  static defaultProps = {
    element: elements.anchor,
    className: '',
    activeClass: '',
    style: {},
    activeStyle: {}
  };

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  };

  state = {};

  // absolute links ('/home') have a depth of 0
  // relative links have the depth of their closest router ancestor
  get depth() {
    const { to } = this.props;
    const depth = this.context.easyRouterDepth || 0;
    const isRelative = !to || to[0] !== '/';
    return isRelative ? depth : 0;
  }

  // gets the full path for relative and absolute links too
  get absolutePath() {
    const { depth, normalizedPath } = normalizePath(this.props.to, this.depth);
    return path.slice(0, depth).concat(normalizedPath);
  }

  // automatically update the link activity on pathname and params changes
  // with a low priority scheduler
  componentDidMount() {
    this.activityUpdater = observe(
      () => this.setState({ isActive: this.isLinkActive() }),
      { scheduler }
    );
  }

  // clean up transparent reactivity connections
  componentWillUnmount() {
    unobserve(this.activityUpdater);
  }

  isLinkActive() {
    const { activeClass, activeStyle, isActive, params, scroll } = this.props;
    // only calculate link activity if there is an activeClass or activeSyle prop
    // otherwise it is not needed
    if (activeClass || activeStyle) {
      // let the user fine tune link activity with an isActive function prop
      if (isActive) {
        return isActive({ path: this.absolutePath, params, scroll });
      }
      return (
        this.isLinkPathActive() &&
        this.isLinkParamsActive() &&
        this.isLinkScrollActive()
      );
    }
  }

  isLinkPathActive() {
    // URL pathname tokens before this.depth always match with the link
    // otherwise the link and its containing Router would not be rendered
    // URL pathname tokens after the link does not affect the check
    // for example '/profile' link matches with '/profile/settings' URL
    return this.absolutePath.every((page, i) => page === path[i]);
  }

  isLinkParamsActive() {
    const linkParams = this.props.params;
    if (linkParams) {
      // extra query params does not affect the match
      // for example { a: 1 } link params matches with { a: 1, b: 2 } URL query
      const paramKeys = Object.keys(linkParams);
      return paramKeys.every(key => linkParams[key] === params[key]);
    }
    return true;
  }

  isLinkScrollActive() {
    const linkScroll = this.props.scroll;
    const historyScroll = history.state.scroll;
    // scroll positions match when the link or the URL is missing a scroll anchor
    // or when the two anchors macth
    if (linkScroll && historyScroll) {
      return linkScroll.anchor === historyScroll.anchor;
    }
    return true;
  }

  onClick = ev => {
    const { to, params, scroll, push, inherit, onClick } = this.props;

    // respect user defined onClick handlers on the Link
    // let the user prevent the routing by ev.preventDefault()
    if (onClick) {
      onClick(ev);
    }

    // if the event is not prevented, route all Routers
    // from below the links depth absolute links have a depth of 0
    if (!ev.defaultPrevented) {
      routeFromDepth({ to, params, scroll, push, inherit }, this.depth);
      // prevent the default behavior of anchor clicks (page reload)
      ev.preventDefault();
    }
  };

  render() {
    let {
      to,
      params,
      scroll,
      element,
      children,
      activeClass,
      activeStyle,
      style,
      className
    } = this.props;
    const { isActive } = this.state;
    const { onClick } = this;

    // calculate a full link href for correct 'Open link in new tab' behavior
    const href = toUrl({
      path: this.absolutePath,
      params,
      scroll
    });

    if (isActive) {
      // both are empty strings by default
      className = `${className} ${activeClass}`;
      // both are empty objects by default
      style = Object.assign({}, style, activeStyle);
    }

    return React.createElement(
      element,
      // forward none Link specific props to the rendered element
      addExtraProps(
        { href, onClick, className, style },
        this.props,
        Link.propTypes
      ),
      children
    );
  }
}
