import { path, params, urlScheduler } from './observables'
import { toPathArray, clear } from './urlUtils'

const routers = []

export let isRouting = false

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

export function route (toPath = location.pathname, newParams = {}, options = {}, depth = 0) {
  urlScheduler.process()
  urlScheduler.stop()

  // push the current state, only use replaceState later
  if (options.history !== false) {
    history.pushState(history.state, '')
  }

  // replace or extend params with nextParams by mutation (do not change the observable ref)
  if (!options.inherit) {
    clear(params)
  }
  Object.assign(params, newParams)

  toPath = path.slice(0, depth).concat(toPathArray(toPath))
  path.length = toPath.length // this is BS, remove it later!

  return routeFromDepth(depth, toPath)
    .then(() => urlScheduler.start())
}

function routeFromDepth (depth, toPath) {
  const fromPage = path[depth]
  const toPage = toPath[depth]
  let routersAtDepth = routers[depth]

  if (!(routersAtDepth && routersAtDepth.size)) {
    return Promise.resolve()
  }

  const routings = Array.from(routersAtDepth)
    .map(router => router.route(fromPage, toPage))

  return Promise.all(routings)
    .then(pages => updatePath(depth, pages))
    .then(() => routeFromDepth(++depth, toPath))
}

function updatePath (depth, pages) {
  // reduce and throw error later!!
  path[depth] = pages[0]
}

// name this routeOnNavigation
export function routeInitial () {
  return route(location.pathname, history.state, { history: false })
}

window.addEventListener('popstate', routeInitial)
