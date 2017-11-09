import { getPages, notEmpty } from './urlUtils'
import { isRouting, startRouting, stopRouting } from './status'
import { links } from './stores'
import { toParams, toQuery, setParams, params as currParams } from './params'

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

export function route (pages = [], params = {}, options = {}) {
  startRouting()

  if (options.inherit === true) {
    params = Object.assign({}, currParams, params)
  }

  setParams(params)

  const routing = pages.length ? routeRoutersFromDepth(0, pages, params) : Promise.resolve()
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
    .then(stopRouting/*, stopRouting*/)
}

// route should call routeFromDepth(0, pages, params, options)

function routeRoutersFromDepth (depth, pageNames, params) {
  const toPageName = pageNames[depth]
  let routersAtDepth = routers[depth]

  if (!routersAtDepth) {
    return Promise.resolve()
  }
  routersAtDepth = Array.from(routersAtDepth)

  return Promise.all(
      routersAtDepth.map(router => router.startRouting(toPageName, params))
    )
    .then(() => routeRoutersAtDepth(depth, routersAtDepth, pageNames, params))
}

function routeRoutersAtDepth (depth, routersAtDepth, pageNames, params) {
  if (isRouting()) {
    return Promise.all(
        routersAtDepth.map(router => router.finishRouting())
      )
      .then(pageNamesAtDepth => reducePageNames(pageNames, pageNamesAtDepth, depth))
      // this doesn't really belong here ):
      .then(() => routeRoutersFromDepth(++depth, pageNames, params))
  }
}

function reducePageNames (pageNames, pageNamesAtDepth, depth) {
  let pageNameAtDepth = pageNamesAtDepth[0]
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
