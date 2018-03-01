import { path, params, scheduler } from 'react-easy-params'
import { toPathArray, clear } from './urlUtils'

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
    clear(params)
  }
  Object.assign(params, newParams)

  path.splice(depth, path.length)
  toPath = path.concat(toPath)

  return routeFromDepth(depth, toPath, true).then(
    finishRouting /*, finishRouting */
  )
}

function routeFromDepth (depth, toPath, initial) {
  const fromPage = path[depth]
  const toPage = toPath[depth]
  let routersAtDepth = routers[depth]

  if (!(routersAtDepth && routersAtDepth.size)) {
    return Promise.resolve()
  }

  const routings = Array.from(routersAtDepth).map(router =>
    router.route(fromPage, toPage, initial)
  )

  return Promise.all(routings).then(() =>
    routeFromDepth(++depth, toPath, false)
  )
}

function finishRouting () {
  isRouting = false
  scheduler.start()
  // if it was an error, rethrow the error here!!
}

window.addEventListener('popstate', () =>
  route(location.pathname, history.state, { history: false })
)
