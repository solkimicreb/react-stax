import React, { Component, PropTypes } from 'react'
import { routeParams, getParams, activate, deactivate } from 'react-easy-params'
import { routers, registerRouter, releaseRouter, route } from './core'
import { getPage, setPage, normalizePath } from './urlUtils'
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

    route (path, params) {
      const pages = normalizePath(path, this.depth)
      return route(pages, params)
    }

    routeRouter (toPageName, params) {
      let toPage = config.pages[toPageName]
      if (!toPage) {
        toPageName = config.default
        toPage = config.pages[toPageName]
      }

      const event = {
        target: this,
        fromPage: this.currentPage,
        toPage: toPageName,
        params,
        preventDefault () {
          this.defaultPrevented = true
        }
      }

      return Promise.resolve()
        .then(() => this.dispatchRouteEvent(config, event))
        .then(() => {
          const store = toPage.store
          if (store && !event.defaultPrevented) {
            // also activate store if there are no params yet!
            activate(store)
            if (params) {
              routeParams(params, store)
            }
          }
        })
        .then(() => this.resolveData(toPage, event))
        .then(() => {
          if (this.currentPage !== toPage && !event.defaultPrevented) {
            this.currentPage = toPage
            setPage(toPageName, this.depth)
            this.forceUpdate()
          }
        })
    }

    dispatchRouteEvent (config, event) {
      if (config.onRoute) {
        return config.onRoute(event)
      }
    }

    resolveData (config, event) {
      if (config.resolve && !event.defaultPrevented) {
        return config.resolve()
      }
    }

    render () {
      return this.currentPage ? React.createElement(this.currentPage.comp) : null
    }
  }
}
