import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observe, unobserve } from '@nx-js/observer-util';
import { toPathArray, toPathString, toQuery, addExtraProps } from '../utils';
import { params, path, scheduler } from '../integrations';
import { routeFromDepth } from './core';

export default class Link extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    // TODO refine this later (string or element)
    element: PropTypes.any,
    params: PropTypes.object,
    options: PropTypes.object,
    onClick: PropTypes.function,
    className: PropTypes.string,
    style: PropTypes.object,
    activeClass: PropTypes.string,
    activeStyle: PropTypes.object,
    isActive: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
  };

  static defaultProps = {
    // rework this later! to be RN compatible
    element: 'a',
    activeClass: '',
    className: '',
    style: {}
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
    let { isActive } = this.props;
    // move this into a util
    if (typeof isActive === 'function') {
      isActive = isActive();
    }
    if (isActive !== undefined) {
      return isActive;
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
    const { params, options, to } = this.props;
    routeFromDepth(to, params, options, this.depth);
    ev.preventDefault();
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

    if (activeClass && isActive) {
      className = `${className} ${activeClass}`;
    }
    if (activeStyle && isActive) {
      style = Object.assign({}, style, activeStyle);
    }

    const href = getPath(to, this.depth) + toQuery(params);

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

function getPath(to, depth) {
  if (!to) {
    return toPathString(path);
  } else if (to[0] !== '/') {
    // improve this BS
    let result = toPathString(path.slice(0, depth));
    if (result.length !== 1) {
      result += '/';
    }
    return result + to;
  }
  return toPathString(to);
}
