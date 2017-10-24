import pushState from 'history-throttler'
import { routeParams, getParams, activate, deactivate } from 'react-easy-params'
import { pageStores, links } from './stores'
import { getPages } from './urlUtils'

export const routers = []

export function registerRouter(router, depth) {
  let routersAtDepth = routers[depth]
  if (!routersAtDepth) {
    routersAtDepth = routers[depth] = new Set()
  }
  routersAtDepth.add(router)
}

export function releaseRouter(router, depth) {
  const routersAtDepth = routers[depth]
  if (routersAtDepth) {
    routersAtDepth.delete(router)
  }
}

export function route (pages, params) {
  // maybe add an intercepting event here too?
  // also add options to use replaceState
  pushState(undefined, '', location.pathname + location.hash)

  // deactivate all page stores (and no app stores)
  pageStores.forEach(deactivate)
  // route params to app stores
  if (params) {
    routeParams(params)
  }
  return pages ? routeRouters(pages, params) : Promise.resolve()
}

function routeRouters (pages, params) {
  return routeRoutersFromDepth(0, pages, params)
    .then(() => {
      links.forEach(link => link.updateActivity())
    })
}

function routeRoutersFromDepth (depth, pages, params) {
  const newPage = pages[depth]
  const routersAtDepth = routers[depth]

  if (!routersAtDepth) {
    return Promise.resolve()
  }

  const routings = Array.from(routersAtDepth).map(router => router.route(newPage, params))
  return Promise.all(routings)
    .then(() => routeRoutersFromDepth(++depth, pages, params))
}

window.addEventListener('load', () => route(getPages(), getParams()))
window.addEventListener('popstate', () => {
  // first deactivate all page stores -> can be reactivated after!
  pageStores.forEach(deactivate)
  routeRouters(getPages())
})
