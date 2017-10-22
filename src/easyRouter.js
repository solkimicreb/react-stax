import React, { Component, PropTypes } from 'react'
import { routeParams, getParams, activate, deactivate } from 'react-easy-params'
import { routers, registerRouter, releaseRouter } from './core'
import { getPage, setPage } from './urlUtils'
import { pageStores } from './stores'

export default function easyRouter (config) {
  // pages must have a comp or a render func!
  if (!config.pages) {
    throw new TypeError('pages must be defined')
  }
  if (!config.default) {
    throw new TypeError('default must be defined')
  }

  for (let pageName in config.pages) {
    const page = config.pages[pageName]
    if (page.store) {
      deactivate(page.store)
      pageStores.add(page.store)
    }
  }

  return class Router extends Component {
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

    route (toPageName, params) {
      let toPage = config.pages[toPageName]
      if (!toPage) {
        toPageName = config.default
        toPage = config.pages[toPageName]
      }

      const store = toPage.store
      if (params && store) {
        activate(store)
        routeParams(params, store)
      }

      const event = {
        target: this,
        fromPage: this.currentPage,
        toPage: toPageName,
        params
      }

      return this.dispatchRouteEvent(config, event)
        .then(() => this.dispatchRouteEvent(toPage, event))
        .then(() => {
          if (this.currentPage !== toPage) {
            this.currentPage = toPage
            setPage(this.toPageName, this.depth)
            this.forceUpdate()
          }
        })
    }

    dispatchRouteEvent (config, event) {
      return config.onRoute ? config.onRoute(event) : Promise.resolve()
    }

    render () {
      return this.currentPage ? React.createElement(this.currentPage.comp) : null
    }
  }
}
