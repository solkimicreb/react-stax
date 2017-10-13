import React, { Component, Children, PropTypes } from 'react'
import { getParams } from 'react-easy-params'
import { routers, registerRouter, releaseRouter } from './core'
import { getPage, setPage } from './urlUtils'

// namespacedepth in some crazy way!
// super simple -> just parse the url token and route based on that!
export default class Router extends Component {
  static PropTypes = {
    onRoute: PropTypes.func,
    defaultPage: PropTypes.string
  };

  static childContextTypes = {
    easyRouterDepth: PropTypes.number
  };

  static contextTypes = {
    easyRouterDepth: PropTypes.number
  };

  getChildContext () {
    const ownDepth = this.context.easyRouterDepth
    return {
      easyRouterDepth: ownDepth ? ownDepth + 1 : 1
    }
  }

  componentWillMount () {
    const depth = this.context.easyRouterDepth || 0
    registerRouter(this, depth)
  }

  componentWillUnmount () {
    const depth = this.context.easyRouterDepth || 0
    releaseRouter(this, depth)
  }

  componentDidMount () {
    const depth = this.context.easyRouterDepth || 0
    this.route(getPage(depth), getParams())
  }

  route (toPage, params) {
    toPage = toPage || this.props.defaultPage

    return this.dispatchRouteEvent(toPage, params)
      .then(() => {
        if (this.currentPage !== toPage) {
          const depth = this.context.easyRouterDepth || 0
          this.currentPage = toPage
          setPage(this.currentPage, depth)
          this.forceUpdate()
        }
      })
  }

  dispatchRouteEvent (toPage, params) {
    const { onRoute } = this.props

    return onRoute ? onRoute({
      target: this,
      fromPage: this.currentPage,
      toPage,
      params
    }) : Promise.resolve()
  }

  render () {
    if (!this.currentPage) {
      return null
    }

    let selectedChild
    Children.forEach(this.props.children, child => {
      const { page } = child.props
      if (!page) {
        throw new Error('Every router child must have page property')
      }
      if (page === this.currentPage) {
        if (selectedChild) {
          throw new Error(
            'Using the same page name for two child in the same router is forbidden'
          )
        }
        selectedChild = child
      }
    })
    return selectedChild
  }
}
