import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observe, unobserve } from '@nx-js/observer-util';
import { routeFromDepth } from './core';
import { toPathArray, toPathString, toQuery, addExtraProps } from '../utils';
import { params, path, scheduler } from '../integrations';

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

  get depth() {
    const { to } = this.props;
    const depth = this.context.easyRouterDepth || 0;
    const isRelative = !to || to[0] !== '/';
    return isRelative ? depth : 0;
  }

  get absolutePath() {
    return path.slice(0, this.depth).concat(toPathArray(this.props.to));
  }

  componentDidMount() {
    this.activityUpdater = observe(
      () => this.setState({ isActive: this.isLinkActive() }),
      { scheduler }
    );
  }

  componentWillUnmount() {
    unobserve(this.activityUpdater);
  }

  isLinkActive() {
    const { isActive, params: linkParams } = this.props;
    if (isActive) {
      return isActive({ linkPath: this.absolutePath, linkParams });
    }
    return this.isLinkPathActive() && this.isLinkParamsActive();
  }

  isLinkPathActive() {
    const { to } = this.props;
    if (to) {
      const linkPath = toPathArray(to);
      return linkPath.every((page, i) => page === path[i + this.depth]);
    }
    return true;
  }

  isLinkParamsActive() {
    const linkParams = this.props.params;
    if (linkParams) {
      const paramKeys = Object.keys(linkParams);
      return paramKeys.every(key => linkParams[key] === params[key]);
    }
    return true;
  }

  onClick = ev => {
    const { params, options, to, onClick } = this.props;
    // this.depth is relative sensitive
    routeFromDepth(to, params, options, this.depth);
    ev.preventDefault();
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

    const href = toPathString(this.absolutePath) + toQuery(params);
    if (isActive) {
      className = `${className} ${activeClass}`;
      style = Object.assign({}, style, activeStyle);
    }

    return React.createElement(
      element,
      addExtraProps(
        { href, onClick, className, style },
        this.props,
        Link.propTypes
      ),
      children
    );
  }
}
