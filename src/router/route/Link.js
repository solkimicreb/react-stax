import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observe, unobserve } from '@nx-js/observer-util';
import { routeFromDepth } from './core';
import { toPathArray, toPathString, toQuery, addExtraProps } from '../utils';
import { params, path, scheduler } from '../integrations';

// Link is used to navigate between pages
// it can be relative ('home') or absolute ('/home'), just like vanilla HTML links
export default class Link extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    element: PropTypes.element,
    params: PropTypes.object,
    options: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    activeClass: PropTypes.string,
    activeStyle: PropTypes.object,
    isActive: PropTypes.func
  };

  static defaultProps = {
    element: 'a',
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
    return path.slice(0, this.depth).concat(toPathArray(this.props.to));
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
    const { activeClass, activeStyle, isActive, params } = this.props;
    // only calculate link activity if there is an activeClass or activeSyle prop
    // otherwise it is not needed
    if (activeClass || activeStyle) {
      // let the user fine tune link activity with an isActive function prop
      if (isActive) {
        return isActive({ linkPath: this.absolutePath, linkParams: params });
      }
      return this.isLinkPathActive() && this.isLinkParamsActive();
    }
  }

  isLinkPathActive() {
    const { to } = this.props;
    if (to) {
      // URL pathname tokens before this.depth always match with the link
      // otherwise the link and its containing Router would not be rendered
      // URL pathname tokens after the link does not affect the check
      // for example '/profile' link matches with '/profile/settings' URL
      const linkPath = toPathArray(to);
      return linkPath.every((page, i) => page === path[i + this.depth]);
    }
    return true;
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

  onClick = ev => {
    const { params, options, to, onClick } = this.props;
    // route all Routers from below the links depth
    // absolute links have a depth of 0
    routeFromDepth(to, params, options, this.depth);
    // prevent the default behavior of anchor clicks (page reload)
    ev.preventDefault();
    // respect user defined onClick handlers on the Link
    if (onClick) {
      onClick(ev);
    }
  };

  render() {
    let {
      to,
      params,
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
    const href = toPathString(this.absolutePath) + toQuery(params);
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
