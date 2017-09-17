import React, {
  PureComponent,
  Children,
  PropTypes,
  createElement,
  cloneElement
} from 'react'
import { easyComp } from 'react-easy-state'
import { normalizePath, isLinkActive } from './urlUtils'
import { route, links } from './core'

class Link extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    element: PropTypes.string,
    activeClass: PropTypes.string,
    params: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string
  }

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  }

  static defaultProps = {
    element: 'a',
    activeClass: 'active'
  }

  constructor() {
    super()
    this.onClick = this.onClick.bind(this)
    this.updateActivity = this.updateActivity.bind(this)
  }

  onClick(ev) {
    ev.preventDefault()
    route(this.tokens, this.props.params)
    if (this.props.onClick) {
      this.props.onClick(ev)
    }
  }

  updateActivity() {
    this.forceUpdate()
  }

  componentWillMount() {
    links.add(this)
  }

  componentWillUnmount() {
    links.delete(this)
  }

  render() {
    const { to, element, children, activeClass } = this.props
    const { onClick } = this

    if (to) {
      const depth = this.context.easyRouterDepth || 0
      this.tokens = normalizePath(to, depth)
    }

    // also take in the params for this!
    const href = this.tokens ? this.tokens.join('/') : ''

    const isActive = isLinkActive(this.tokens, this.props.params)
    let className = isActive ? activeClass : ''
    if (this.props.className) {
      className += ` ${this.props.className}`
    }

    const anchor = createElement('a', { onClick, href }, children)
    if (element === 'a') {
      return cloneElement(anchor, { className }, children)
    }
    return createElement(element, { className }, anchor)
  }
}

export default easyComp(Link)
