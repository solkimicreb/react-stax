import { toPages, clear } from './urlUtils'
import { pages, params, urlScheduler } from './observables'

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

export function route (newPages = pages, newParams = {}, options = {}) {
  urlScheduler.process()
  urlScheduler.stop()

  // push the current state, only use replaceState later
  if (options.history !== false) {
    history.pushState(history.state, '')
  }

  // clear the current pages, it will be rebuilt by the routers during the routing
  clear(pages)

  // replace or extend params with nextParams by mutation (do not change the observable ref)
  if (!options.inherit) {
    clear(params)
  }
  Object.assign(params, newParams)

  return routeFromDepth(0, newPages)
    .then(() => urlScheduler.start())
}

function routeFromDepth (depth, pages) {
  const toPage = pages[depth]
  let routersAtDepth = routers[depth]

  if (!routersAtDepth) {
    return Promise.resolve()
  }
  routersAtDepth = Array.from(routersAtDepth)

  console.log('route', routersAtDepth)

  return startRoutingAtDepth(routersAtDepth, toPage)
    .then((events) => finishRoutingAtDepth(depth, routersAtDepth, events))
    .then(() => routeFromDepth(++depth, pages))
}

function startRoutingAtDepth (routersAtDepth, toPage) {
  console.log('routers', Array.from(routersAtDepth))
  return Promise.all(routersAtDepth.map(router => router.startRouting(toPage)))
}

function finishRoutingAtDepth (depth, routersAtDepth, events) {
  if (events.length) {
    const toPage = events[0].toPage
    const pagesMatch = events.every(event => event.toPage === toPage)
    if (!pagesMatch) {
      throw new Error('Pages do not match for parallel routers')
    }
    pages[depth] = toPage
  }

  const defaultPrevented = events.some(event => event.defaultPrevented)
  if (!defaultPrevented) {
    return Promise.all(routersAtDepth.map(router => router.finishRouting()))
  }
}

// name this routeOnNavigation
export function routeInitial () {
  const pages = toPages(location.pathname)
  const params = history.state
  return route(pages, params, { history: false })
}

window.addEventListener('popstate', routeInitial)
