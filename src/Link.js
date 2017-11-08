import React, {
  Component,
  Children,
  PropTypes,
  createElement,
  cloneElement
} from 'react'
import { normalizePath, isLinkActive } from './urlUtils'
import { route } from './core'
import { links } from './stores'

export default class Link extends Component {
  static propTypes = {
    to: PropTypes.string,
    element: PropTypes.string,
    activeClass: PropTypes.string,
    params: PropTypes.object,
    options: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string
  }

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  }

  static defaultProps = {
    element: 'a',
    activeClass: '',
    className: ''
  }

  get depth () {
    return this.context.easyRouterDepth || 0
  }

  constructor (props, context) {
    super(props, context)

    this.onClick = this.onClick.bind(this)

    this.resolvePageNames()
    this.isActive = isLinkActive(this.toPageNames, props.params)

    if (props.activeClass) {
      links.add(this)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeClass) {
      links.add(this)
    }
  }

  componentWillUnmount () {
    links.delete(this)
  }

  onClick (ev) {
    const { onClick, params, options } = this.props

    ev.preventDefault()
    route(this.toPageNames, params, options)

    // maybe only call this after the routing is over!!
    if (onClick) {
      onClick(ev)
    }
  }

  resolvePageNames () {
    const { to } = this.props
    if (to) {
      this.toPageNames = normalizePath(to, this.depth)
      this.href = this.toPageNames.join('/')
    }
  }

  updateActivity () {
    const wasActive = this.isActive
    const isActive = isLinkActive(this.toPageNames, this.props.params)
    if (wasActive !== isActive) {
      this.isActive = isActive
      this.forceUpdate()
    }
  }

  render() {
    let { to, element, children, activeClass, params, className } = this.props
    const { onClick, href, isActive } = this

    activeClass = isActive ? activeClass : ''
    className = `${className} ${activeClass}`

    const anchor = createElement('a', { onClick, href }, children)
    if (element === 'a') {
      return cloneElement(anchor, { className }, children)
    }
    return createElement(element, { className }, anchor)
  }
}
