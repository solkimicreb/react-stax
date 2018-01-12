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
  isRouting = true
  toPath = toPathArray(toPath)

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

  path.splice(depth, path.length)

  return routeFromDepth(depth, toPath)
    .then(finishRouting, finishRouting)
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
    .then(() => routeFromDepth(++depth, toPath))
}

function finishRouting () {
  isRouting = false
  urlScheduler.start()
  // if it was an error, rethrow the error here!!
}

window.addEventListener(
  'popstate',
  () => route(location.pathname, history.state, { history: false })
)
