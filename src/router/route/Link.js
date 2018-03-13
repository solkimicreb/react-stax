import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { observe, unobserve } from '@nx-js/observer-util'
import { toPathArray, toQuery, scheduler } from '../utils'
import { params, path } from '../integrations'
import { routeFromDepth } from './core'

export default class Link extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    element: PropTypes.string,
    params: PropTypes.object,
    options: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
    activeClass: PropTypes.string,
    activeStyle: PropTypes.object,
    onClick: PropTypes.func
  };

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  };

  static defaultProps = {
    element: 'a',
    activeClass: '',
    className: '',
    style: {}
  };

  state = {};

  get linkDepth () {
    const { to } = this.props
    const depth = this.context.easyRouterDepth || 0
    const isRelative = !to || to[0] !== '/'
    return isRelative ? depth : 0
  }

  componentDidMount () {
    this.activityUpdater = observe(
      () => this.setState({ isActive: this.isLinkActive() }),
      { scheduler }
    )
  }

  componentWillUnmount () {
    unobserve(this.activityUpdater)
  }

  isLinkActive () {
    return this.isLinkPathActive() && this.isLinkParamsActive()
  }

  isLinkPathActive () {
    const { to } = this.props
    if (to) {
      const linkPath = toPathArray(to)
      return linkPath.every((page, i) => page === path[i + this.linkDepth])
    }
    return true
  }

  isLinkParamsActive () {
    const linkParams = this.props.params
    if (linkParams) {
      for (let param in linkParams) {
        if (linkParams[param] !== params[param]) {
          return false
        }
      }
    }
    return true
  }

  onClick = ev => {
    ev.preventDefault()
    const { onClick, params, options, to } = this.props
    if (onClick) {
      onClick(ev)
    }

    routeFromDepth(to, params, options, this.linkDepth)
  };

  render () {
    let {
      to,
      element,
      children,
      activeClass,
      activeStyle,
      style,
      params,
      className
    } = this.props
    const { isActive } = this.state
    const { onClick } = this

    if (activeClass && isActive) {
      className = `${className} ${activeClass}`
    }
    if (activeStyle && isActive) {
      style = Object.assign({}, style, activeStyle)
    }
    const href = to + toQuery(params)

    const anchor = React.createElement('a', { onClick, href }, children)
    if (element === 'a') {
      return React.cloneElement(anchor, { className, style }, children)
    }
    return React.createElement(element, { className, style }, anchor)
  }
}
