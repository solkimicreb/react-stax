import pushState from 'history-throttler'
import { routeParams, getParams, activate, deactivate } from 'react-easy-params'
import { appStores, activePageStores, links } from './stores'
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
  /*if (!init) {
    pushState(undefined, '', location.pathname + location.hash)
  }*/

  // deactivate all page stores (and no app stores)
  appStores.forEach(deactivate)
  activePageStores.forEach(deactivate)
  activePageStores.clear()
  // route params to app stores
  if (params) {
    appStores.forEach(store => routeParams(params, store))
  }

  const routing = pages ? routeRoutersFromDepth(0, pages, params) : Promise.resolve()
  return routing
    // pages are patched on the go, update URL here!
    .then(() => {
      setPages(pages) // later this should sey without the params -> they are added later
      appStores.forEach(activate)
      activePageStores.forEach(activate)
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
      return routeRoutersFromDepth(++depth, pages, params)
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
  const pages = getPages()

  routeRoutersFromDepth(0, pages)
    .then(() => {
      const url = pages.join('/') + location.search + location.hash
      history.replaceState(undefined, '', url)
      appStores.forEach(activate)
      activePageStores.forEach(activate)
      links.forEach(link => link.updateActivity())
      // call this with query at the end history.replaceState(undefined, '', pages.join('/') + location.hash)
    })
})
window.addEventListener('popstate', () => {
  routeRoutersFromDepth(0, getPages(), getParams())
    .then(() => {
      appStores.forEach(activate)
      activePageStores.forEach(activate)
      links.forEach(link => link.updateActivity())
    })
})
