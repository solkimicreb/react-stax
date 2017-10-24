import pushState from 'history-throttler'
import { routeParams, getParams, activate, deactivate } from 'react-easy-params'
import { pageStores, links } from './stores'
import { getPages, setPages } from './urlUtils'

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

export function route (pages, params, init) {
  // maybe add an intercepting event here too?
  // also add options to use replaceState
  if (!init) {
    pushState(undefined, '', location.pathname + location.hash)
  }

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
    // pages are patched on the go, update URL here!
    .then(() => setPages(pages)) // later this should sey without the params -> they are added later
    // I also have to cut array length at the final depth
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

  const routings = Array.from(routersAtDepth).map(router => router.routeRouter(newPage, params))
  return Promise.all(routings)
    .then(pagesAtDepth => {
      const pageAtDepth = reducePages(pagesAtDepth, depth)
      pages[depth] = pageAtDepth
      routeRoutersFromDepth(++depth, pages, params)
    })
}

function reducePages (pages, depth) {
  let result = pages[0]
  for (let page of pages) {
    if (page !== result) {
      throw new Error(`Unmatching pages ${page}, ${result} at depth ${depth}`)
    }
  }
  return result
}

window.addEventListener('load', () => {
  // initial routing
  route(getPages(), getParams(), true)
})
window.addEventListener('popstate', () => {
  // first deactivate all page stores -> can be reactivated after!
  pageStores.forEach(deactivate)
  routeRouters(getPages())
})
