import pushState from 'history-throttler'
import { routeParams, getParams, activate, deactivate } from 'react-easy-params'
import { appStores, activePageStores, links } from './stores'
import { getPages, setPages } from './urlUtils'
import { isRouting, startRouting, stopRouting } from './status'

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

  // indicate that a routing is taking place
  if(isRouting()) {
    console.warn('Returning early from routing. Another routing process is already taking place')
    return
  }
  startRouting()

  // deactivate all page stores (and no app stores)
  appStores.forEach(deactivate)
  activePageStores.forEach(deactivate)
  activePageStores.clear()
  links.forEach(link => link.isActive = false)
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
      links.forEach(link => {
        links.isActive = true
        link.updateActivity()
      })
    })
    .then(stopRouting)
    .catch(stopRouting)
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

// later export it from a specific depth
export function routeInitial () {
  links.forEach(link => link.isActive = false)
  const pages = getPages()

  routeRoutersFromDepth(0, pages)
    .then(() => {
      const url = pages.join('/') + location.search + location.hash
      history.replaceState(undefined, '', url)
      appStores.forEach(activate)
      activePageStores.forEach(activate)
      links.forEach(link => {
        link.isActive = true
        link.updateActivity()
      })
      // call this with query at the end history.replaceState(undefined, '', pages.join('/') + location.hash)
    })
}

window.addEventListener('popstate', () => {
  links.forEach(link => link.isActive = false)

  routeRoutersFromDepth(0, getPages(), getParams())
    .then(() => {
      appStores.forEach(activate)
      activePageStores.forEach(activate)
      links.forEach(link => {
        link.isActive = true
        link.updateActivity()
      })
    })
})
