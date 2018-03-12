import { path, params, scheduler } from 'react-easy-params'
import { toPathArray, toPathString, toParams, reThrow } from './urlUtils'

const routers = []

let routing

export function registerRouter (router, depth) {
  let routersAtDepth = routers[depth]
  if (!routersAtDepth) {
    routersAtDepth = routers[depth] = new Set()
  }
  routersAtDepth.add(router)
  // route the router if we are not routing currently
  if (!routing) {
    router._route(path[depth], path[depth])
  }
}

export function releaseRouter (router, depth) {
  const routersAtDepth = routers[depth]
  if (routersAtDepth) {
    routersAtDepth.delete(router)
  }
}

export function route ({
    to: toPath = location.pathname,
    params: newParams = {},
    options = {}
  },
  depth = 0
) {
  if (routing) {
    routing.cancelled = true
  } else {
    // only process if we are not yet routing to prevent mid routing flash!
    scheduler.process()
  }
  const localRouting = routing = {}
  scheduler.stop()

  toPath = toPathArray(toPath)


  // replace or extend params with nextParams by mutation (do not change the observable ref)
  if (!options.inherit) {
    for (let key of Object.keys(params)) {
      delete params[key]
    }
  }
  Object.assign(params, newParams)

  toPath = path.slice(0, depth).concat(toPath)

  return routeFromDepth(depth, toPath, localRouting).then(
    () => !localRouting.cancelled && onRoutingEnd(options),
    reThrow(() => !localRouting.cancelled && onRoutingEnd(options, error))
  )
}

function routeFromDepth (depth, toPath, routing) {
  // issue this might change too early with parallel routers
  const fromPage = path[depth]
  const toPage = toPath[depth]
  const routersAtDepth = Array.from(routers[depth] || [])

  if (routing.cancelled || !routersAtDepth.length) {
    return Promise.resolve()
  }

  const routings = routersAtDepth.map(
    router => router._route(fromPage, toPage)
  )

  return Promise.all(routings)
    .then(() => routeFromDepth(++depth, toPath, routing))
}

function onRoutingEnd (options) {
  // by default a history item is pushed if the pathname changes!
  if (options.history === true || (options.history !== false && toPathString(path) !== location.pathname)) {
    history.pushState(history.state, '')
  }

  scheduler.process()
  scheduler.start()
  routing = undefined
}

window.addEventListener('popstate', () =>
  route({ to: location.pathname, params: toParams(location.search), options: { history: false } })
)
