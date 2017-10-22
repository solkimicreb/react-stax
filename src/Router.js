import React, { Component, Children, PropTypes } from 'react'
import { routeParams, getParams, activate } from 'react-easy-params'
import { routers, registerRouter, releaseRouter } from './core'
import { getPage, setPage } from './urlUtils'
import { pageStores } from './stores'

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

  get depth () {
    return this.context.easyRouterDepth || 0
  }

  getChildContext () {
    return {
      easyRouterDepth: this.depth + 1
    }
  }

  componentWillMount () {
    registerRouter(this, this.depth)
  }

  componentWillUnmount () {
    releaseRouter(this, this.depth)
  }

  componentDidMount () {
    this.route(getPage(this.depth), getParams())
  }

  route (toPage, params) {
    toPage = toPage || this.props.defaultPage
    const store = pageStores.get(toPage)
    if (params && store) {
      activate(store)
      routeParams(params, store)
    }

    return this.dispatchRouteEvent(toPage, params)
      .then(() => {
        if (this.currentPage !== toPage) {
          this.currentPage = toPage
          setPage(this.currentPage, this.depth)
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
