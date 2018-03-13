import { path, params, scheduler } from 'react-easy-params'
import {
  toPathArray,
  toPathString,
  toParams,
  rethrow,
  clear,
  RoutingStatus
} from './urlUtils'

const routers = []
let routingStatus

export function registerRouter (router, depth) {
  let routersAtDepth = routers[depth]
  if (!routersAtDepth) {
    routersAtDepth = routers[depth] = new Set()
  }
  routersAtDepth.add(router)
  // route the router if we are not routing currently
  if (!routingStatus) {
    Promise.resolve()
      .then(() => router.init(path[depth], path[depth]))
      .then(toChild => router.resolve(toChild))
      .then(nextState => router.switch(nextState, path[depth]))
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

  // check routersAtDepth defaultPage -> throw an error if they differ

  const children = routersAtDepth.map(router => router.init(path[depth], toPath[depth]))

  // add status checks
  return Promise.all(
    routersAtDepth.map((router, i) => router.resolve(children[i]))
  )
    .then(states => Promise.all(
      routersAtDepth.map((router, i) => router.switch(states[i], path[depth]))
    ))
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
  routingStatus = undefined
}

window.addEventListener('popstate', () =>
  route({
    to: location.pathname,
    params: toParams(location.search),
    options: { history: false }
  })
)
