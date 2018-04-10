import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observe, unobserve } from '@nx-js/observer-util';
import { integrationScheduler as scheduler, location, anchor } from 'env';
import { toPathArray, toQuery, addExtraProps } from '../utils';
import { params, path } from '../integrations';
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
    activeStyle: PropTypes.object
  };

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  };

  static defaultProps = {
    // rework this later! to be RN compatible
    element: anchor,
    activeClass: '',
    className: '',
    style: {}
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
      for (let param in linkParams) {
        if (linkParams[param] !== params[param]) {
          return false;
        }
      }
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
    // TODO: this has an issue -> it should be always the whole new path!
    // calculate it from depth, to, location.pathname
    const href = (to || location.pathname) + toQuery(params);

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
