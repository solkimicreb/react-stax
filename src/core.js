import { getPages, notEmpty } from './urlUtils'
import { isRouting, startRouting, stopRouting } from './status'
import { links } from './stores'
import { toParams, toQuery, getParams, setParams } from './params'

const routers = []

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
  startRouting()

  if (options.inherit === true) {
    const prevParams = getParams()
    params = Object.assign({}, prevParams, params)
  }

  setParams(params)

  const routing = pages ? routeRoutersFromDepth(0, pages, params) : Promise.resolve()
  return routing
    .then(() => {
      const url = pages.filter(notEmpty).join('/') + toQuery(params) + location.hash

      if (options.history !== false) {
        history.pushState(params, '', url)
      } else {
        history.replaceState(params, '', url)
      }

      links.forEach(link => link.updateActivity())
    })
    // issue -> this swallows errors -> I should rethrow them instead!
    .then(stopRouting, stopRouting)
}

// route should call routeFromDepth(0, pages, params, options)

function routeRoutersFromDepth (depth, pageNames, params) {
  const toPageName = pageNames[depth]
  let routersAtDepth = routers[depth]

  if (!routersAtDepth) {
    return Promise.resolve()
  }
  routersAtDepth = Array.from(routersAtDepth)

  const pages = routersAtDepth.map(
    router => router.selectPage(toPageName)
  )

  const events = routersAtDepth.map(
    router => router.dispatchRouteEvent(params)
  )

  return Promise.all(pages)
    .then(() => Promise.all(events))
    .then(() => routeRoutersAtDepth(depth, routersAtDepth, pageNames))
    .then(() => routeRoutersFromDepth(++depth, pageNames, params))
}

function routeRoutersAtDepth (depth, routersAtDepth, pageNames) {
  if (isRouting()) {
    const loaders = routersAtDepth.map(
      router => router.loadPage()
    )

    const routings = routersAtDepth.map(
      router => router.routeToPage()
    )

    return Promise.all(loaders)
      .then(() => Promise.all(routings))
      .then(pageNamesAtDepth => reducePageNames(pageNames, pageNamesAtDepth, depth))
  }
}

function reducePageNames (pageNames, pageNamesAtDepth, depth) {
  let pageNameAtDepth = pageNames[0]
  for (let pageName of pageNamesAtDepth) {
    if (pageName !== pageNameAtDepth) {
      throw new Error(`Unmatching pages ${pageName}, ${pageNameAtDepth} at depth ${depth}`)
    }
  }
  pageNames[depth] = pageNameAtDepth
}

export function routeInitial () {
  return route(getPages(), history.state, { history: false })
}

window.addEventListener('popstate', routeInitial)
