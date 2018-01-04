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

export function route (newPages = pages, newParams = {}, options = {}, depth = 0) {
  urlScheduler.process()
  urlScheduler.stop()

  console.log(Array.from(newPages), depth)
  // push the current state, only use replaceState later
  if (options.history !== false) {
    history.pushState(history.state, '')
  }

  // clear the current pages, it will be rebuilt by the routers during the routing
  // clear(pages)
  pages.length = pages.length

  const nPages = pages.slice(0, depth)
  nPages.push(...newPages)

  // replace or extend params with nextParams by mutation (do not change the observable ref)
  if (!options.inherit) {
    clear(params)
  }
  Object.assign(params, newParams)

  return routeFromDepth(depth, nPages)
    .then(() => {
      urlScheduler.start()
      // pages.lenght = newPages.length
    })
}

function routeFromDepth (depth, newPages) {
  const toPage = newPages[depth]
  let routersAtDepth = routers[depth]

  if (!routersAtDepth) {
    return Promise.resolve()
  }
  routersAtDepth = Array.from(routersAtDepth)
  console.log(newPages, depth)

  return Promise.all(routersAtDepth.map(router => router.route(toPage)))
    .then(() => routeFromDepth(++depth, newPages))
}

// name this routeOnNavigation
export function routeInitial () {
  const pages = toPages(location.pathname)
  const params = history.state
  return route(pages, params, { history: false })
}

window.addEventListener('popstate', routeInitial)
