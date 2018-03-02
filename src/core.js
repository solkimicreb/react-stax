import { path, params, scheduler } from 'react-easy-params'
import { toPathArray, toParams } from './urlUtils'

const routers = []

export let isRouting = false

export function registerRouter (router, depth) {
  let routersAtDepth = routers[depth]
  if (!routersAtDepth) {
    routersAtDepth = routers[depth] = new Set()
  }
  routersAtDepth.add(router)
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
  console.log('global route', toPath, newParams, options, depth)
  isRouting = true
  toPath = toPathArray(toPath)

  scheduler.process()
  scheduler.stop()

  // push the current state, only use replaceState later
  if (options.history !== false) {
    history.pushState(history.state, '')
  }

  // replace or extend params with nextParams by mutation (do not change the observable ref)
  if (!options.inherit) {
    for (let key of Object.keys(params)) {
      delete params[key]
    }
  }
  Object.assign(params, newParams)

  path.splice(depth, path.length)
  toPath = path.concat(toPath)

  return routeFromDepth(depth, toPath).then(
    onRoutingSuccess, onRoutingError
  )
}

function routeFromDepth (depth, toPath) {
  const fromPage = path[depth]
  const toPage = toPath[depth]
  let routersAtDepth = routers[depth]

  console.log('route from depth', depth, toPath)

  if (!(routersAtDepth && routersAtDepth.size)) {
    return Promise.resolve()
  }

  const routings = Array.from(routersAtDepth).map(router =>
    router.route(fromPage, toPage)
  )

  return Promise.all(routings).then(() =>
    routeFromDepth(++depth, toPath, false)
  )
}

function onRoutingSuccess () {
  isRouting = false
  scheduler.process()
  scheduler.start()
}

function onRoutingError (error) {
  onRoutingSuccess()
  throw error
}

window.addEventListener('popstate', () =>
  route({ to: location.pathname, params: toParams(location.search), options: { history: false } })
)
