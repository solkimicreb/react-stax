import { path, params } from '../integrations'
import {
  toPathArray,
  toPathString,
  toParams,
  rethrow,
  clear,
  scheduler
} from '../utils'

const routers = []
let routingStatus
let initStatuses = []

class RoutingStatus {
  check (fn) {
    return () => (this.cancelled ? undefined : fn())
  }
}

export function registerRouter (router, depth) {
  let routersAtDepth = routers[depth]
  if (!routersAtDepth) {
    routersAtDepth = routers[depth] = new Set()
  }
  routersAtDepth.add(router)
  // route the router if we are not routing currently
  if (!routingStatus) {
    const status = new RoutingStatus()
    initStatuses.push(status)
    Promise.resolve()
      .then(() => router.init(path[depth], path[depth]))
      .then(toChild => router.resolve(toChild, status))
      .then(nextState => router.switch(nextState, status))
  }
}

export function releaseRouter (router, depth) {
  const routersAtDepth = routers[depth]
  if (routersAtDepth) {
    routersAtDepth.delete(router)
  }
}

export function route ({ to, params, options } = {}) {
  routeFromDepth(to, params, options, 0)
}

export function routeFromDepth (
  toPath = location.pathname,
  newParams = {},
  options = {},
  depth = 0
) {
  // cancel inits
  if (initStatuses.length) {
    initStatuses.forEach(status => (status.cancelled = true))
    initStatuses = []
  }
  if (routingStatus) {
    routingStatus.cancelled = true
  } else {
    // only process if we are not yet routing to prevent mid routing flash!
    scheduler.process()
  }
  const status = (routingStatus = new RoutingStatus())
  scheduler.stop()

  // replace or extend params with nextParams by mutation (do not change the observable ref)
  if (!options.inherit) {
    clear(params)
  }
  Object.assign(params, newParams)
  toPath = path.slice(0, depth).concat(toPathArray(toPath))

  return switchRoutersFromDepth(toPath, depth, status).then(
    status.check(() => onRoutingEnd(options)),
    rethrow(status.check(() => onRoutingEnd(options)))
  )
}

function switchRoutersFromDepth (toPath, depth, status) {
  const routersAtDepth = Array.from(routers[depth] || [])

  if (!routersAtDepth.length) {
    return Promise.resolve()
  }

  const children = routersAtDepth.map(router =>
    router.init(path[depth], toPath[depth])
  )
  return Promise.all(
    routersAtDepth.map((router, i) => router.resolve(children[i], status))
  )
    .then(states =>
      Promise.all(
        routersAtDepth.map((router, i) => router.switch(states[i], status))
      )
    )
    .then(status.check(() => switchRoutersFromDepth(toPath, ++depth, status)))
}

function onRoutingEnd (options) {
  // by default a history item is pushed if the pathname changes!
  if (
    options.history === true ||
    (options.history !== false && toPathString(path) !== location.pathname)
  ) {
    history.pushState(history.state, '')
  }

  scheduler.process()
  scheduler.start()
}

window.addEventListener('popstate', () =>
  route({
    to: location.pathname,
    params: toParams(location.search),
    options: { history: false }
  })
)
