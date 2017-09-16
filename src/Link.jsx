import React, {
  PureComponent,
  Children,
  PropTypes,
  createElement,
  cloneElement
} from 'react'
import { normalizePath, isLinkActive } from './urlUtils'
import { route, links } from './core'

export default class Link extends PureComponent {
  state = {};

  static propTypes = {
    to: PropTypes.string,
    element: PropTypes.string,
    activeClass: PropTypes.string,
    params: PropTypes.object
  };

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  };

  static defaultProps = {
    element: 'a',
    activeClass: 'active'
  };

  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
    this.updateActivity = this.updateActivity.bind(this)
  }

  onClick (ev) {
    ev.preventDefault()
    route(this.tokens, this.props.params)
  }

  updateActivity () {
    this.setState({ isActive: isLinkActive(this.tokens, this.props.params) })
  }

  componentWillMount () {
    links.add(this)
  }

  componentWillUnmount () {
    links.delete(this)
  }

  render () {
    const { to, element, children, activeClass } = this.props
    const { onClick } = this

    if (to) {
      const depth = this.context.easyRouterDepth || 0
      this.tokens = normalizePath(to, depth)
    }

    // also take in the params for this!
    const href = this.tokens ? this.tokens.join('/') : ''

    const isActive = this.state.isActive || isLinkActive(this.tokens, this.props.params)
    const className = isActive ? activeClass : ''

    const anchor = createElement('a', { onClick, href }, children)
    if (element === 'a') {
      return cloneElement(anchor, { className }, children)
    }
    return createElement(element, { className }, anchor)
  }
}
