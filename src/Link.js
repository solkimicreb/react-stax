import React, {
  Component,
  Children,
  PropTypes,
  createElement,
  cloneElement
} from 'react'
import { easyComp } from 'react-easy-state'
import { normalizePath } from './urlUtils'
import { route } from './core'
import { params } from './params'
import { pages } from './pages'

class Link extends Component {
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

  store = {
    toPageNames: [],
    href: ''
  }

  get depth () {
    return this.context.easyRouterDepth || 0
  }

  constructor (props, context) {
    super(props, context)
    this.resolvePageNames(props.to)
  }

  componentWillReceiveProps ({ to }) {
    if (to && to !== this.props.to) {
      this.resolvePageNames(to)
    }
  }

  resolvePageNames (toPageNames) {
    this.store.toPageNames = normalizePath(toPageNames, this.depth)
    this.store.href = this.store.toPageNames.join('/')
  }

  isLinkActive () {
    return this.isLinkPagesActive() && this.isLinkParamsActive()
  }

  isLinkPagesActive () {
    const linkPages = this.store.toPageNames
    if (linkPages) {
      for (let i = 0; i < linkPages.length; i++) {
        if (linkPages[i] !== pages[i]) {
          return false
        }
      }
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

  onClick (ev) {
    ev.preventDefault()
    const { onClick, params, options } = this.props
    if (onClick) {
      onClick(ev)
    }
    route(this.store.toPageNames, params, options)
  }

  render () {
    let { to, element, children, activeClass, params, className } = this.props
    const { toPageNames, href } = this.store
    const { onClick, isLinkActive } = this

    if (activeClass && isLinkActive()) {
      className = `${className} ${activeClass}`
    }

    const anchor = createElement('a', { onClick, href }, children)
    if (element === 'a') {
      return cloneElement(anchor, { className }, children)
    }
    return createElement(element, { className }, anchor)
  }
}

export default easyComp(Link)
