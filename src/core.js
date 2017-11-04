import pushState from 'history-throttler'
import { getPages, notEmpty } from './urlUtils'
import { isRouting, startRouting, stopRouting } from './status'
import { links } from './stores'
import { toParams, toQuery } from './params'

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

export function route (pages, params = {}, options = {}) {
  if(isRouting()) {
    console.warn('Returning early from routing. Another routing process is already taking place')
    return
  }
  startRouting()

  if (options.inherit === true) {
    params = Object.assign(history.state, params)
  }

  if (options.history !== false) {
    pushState(params, '')
  } else {
    history.replaceState(params, '')
  }

  const routing = pages ? routeRoutersFromDepth(0, pages, params) : Promise.resolve()
  return routing
    // pages are patched on the go, update URL here!
    .then(() => {
      const url = pages.filter(notEmpty).join('/') + toQuery(params) + location.hash
      // I only do the pushState here?? -> fail -> I have to start with a pushState!!
      history.replaceState(history.state, '', url)
      // links.forEach(link => link.updateActivity())
    })
    .then(stopRouting, stopRouting)
}

function routeRoutersFromDepth (depth, pages, params) {
  const newPage = pages[depth]
  const routersAtDepth = routers[depth]

  if (!routersAtDepth) {
    return Promise.resolve()
  }

  const routings = Array.from(routersAtDepth)
    .map(router => router.routeRouter(newPage, params))

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

export function routeInitial () {
  return route(getPages(), history.state, { history: false })
}

window.addEventListener('popstate', routeInitial)
