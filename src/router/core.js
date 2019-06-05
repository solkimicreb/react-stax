import { path, history, scroller } from 'platform'
import { normalizePath, replace, schedulers } from 'utils'

const routers = []
let routingStatus
const initStatuses = new Set()

// register a router at a given depth
export function registerRouter (router, depth) {
  // there can be multiple parallel routers at a given depth (we need a Set)
  if (!routers[depth]) {
    routers[depth] = new Set()
  }
  routers[depth].add(router)
  // route the newly added router, if we are not routing currently
  // or if the routing process is already past the current depth
  // this may happen if the router is not added because of the routing process
  // but was hidden some by conditional or lazy loading for example
  if (!routingStatus || depth <= routingStatus.depth) {
    initRouter(router)
  }
}

// router newly added routers even if there is no ongoing routing process
function initRouter (router) {
  const status = { cancelled: false }
  initStatuses.add(status)

  return Promise.resolve()
    .then(() => router.startRouting())
    .then(
      // cancel the routing if a new routing started in the meantime
      resolvedData =>
        !status.cancelled && router.finishRouting(resolvedData, status)
    )
    .then(() => initStatuses.delete(status))
}

// release routers on componentWillUnmount
export function releaseRouter (router, depth) {
  routers[depth].delete(router)
}

// this is part of the public API
// it cancels ongoing routings and recursively routes all routers from the root level
export function route (
  { to, params = {}, session = {}, scroll, push } = {},
  depth = 0
) {
  // there may be routers which route outside of the standard routing process
  // for example a router was added by lazy loading and does its initial routing
  // cancel routings for these routers
  initStatuses.forEach(status => (status.cancelled = true))
  // cancel the standard ongoing routing process if there is one
  if (routingStatus) {
    routingStatus.cancelled = true
  } else {
    // flush the pending low priority URL changes to have a consistent state before starting a new routing
    // only flush it if there is no ongoing routing
    // otherwise the old and new routing should be treated in one batch to avoid flicker
    schedulers.low.process()
    // the push option should default to true when the routing is not started
    // from an interception, otherwise it stays falsy
    if (push === undefined) {
      push = true
    }
  }
  // stop all schedulers until the end of the routing and commit them at once
  // this includes state based view updates, URL updates and localStorag updates
  // having view updates during the routing can cause flickers
  // because of the random onRoute data resolve timings, it is nicer to commit everything at once
  schedulers.stop()

  // create a new routing status
  // this may be cancelled by future routing processes
  // always start the routing from the root level router, even when it does not
  // produce any visual changes
  const status = (routingStatus = { cancelled: false, depth: 0 })

  const toPath = to ? normalizePath(path, to, depth) : path
  // push a new history item when necessary
  // it is important to do this before restarting the schedulers
  // to apply all new history replace operations to the new item
  // it is also important to do it before the view routing,
  // because the scroll position is saved here for the auto restoration
  if (push) {
    history.push({ path: toPath, params, session, scroll })
  } else {
    history.replace({ path: toPath, params, session, scroll })
  }

  // recursively route all routers, then finish the routing
  return Promise.resolve()
    .then(() => switchRoutersFromDepth(status))
    .then(() => finishRouting({ scroll }, status))
}

// this recursively routes all parallel routers form a given depth
// all routers are finished routing at a depth before continuing with the next depth
function switchRoutersFromDepth (status) {
  const routersAtDepth = Array.from(routers[status.depth] || [])

  if (routersAtDepth.length) {
    return (
      Promise.resolve()
        // during the first routing half, the user may intercept the routing
        // and cancel it by triggering a new routing
        // we have to wait for all routers before we can go on
        // to make sure the routing was not cancelled
        .then(() => startRoutingAtDepth(routersAtDepth, status))
        // after all routers finished the first half, all of them does the second half
        .then(resolvedData =>
          finishRoutingAtDepth(routersAtDepth, resolvedData, status)
        )
        // all routers finished routing at this depth, go on with the next depth
        .then(() => {
          ++status.depth
          return switchRoutersFromDepth(status)
        })
    )
  }
}

// do the first routing half if the routing is not cancelled
// it includes data resolving, interception and lazy loading
function startRoutingAtDepth (routersAtDepth, status) {
  if (!status.cancelled) {
    return Promise.all(routersAtDepth.map(router => router.startRouting()))
  }
}

// do the second routing half if the routing is not cancelled
function finishRoutingAtDepth (routersAtDepth, resolvedData, status) {
  if (!status.cancelled) {
    return Promise.all(
      routersAtDepth.map((router, i) =>
        router.finishRouting(resolvedData[i], status)
      )
    )
  }
}

// all routers updated recursively by now, it is time to finish the routing
// if it was not cancelled in the meantime
function finishRouting ({ scroll }, status) {
  if (!status.cancelled) {
    // handle the scroll after the whole routing is over
    // this makes sure that the necessary elements are already rendered
    // in case of a scrollToAnchor behavior
    if (typeof scroll === 'object') {
      scroller.scrollTo(scroll)
      // scroll === false lets the browser do its default scroll restoration
    } else if (scroll !== false) {
      scroller.scrollTo({ top: 0, left: 0 })
    }

    // wait with anything resource intensive
    // until the whole routing is finished to keep it smooth
    // allowing view updates during the routing could also cause potential flicker
    // and tearing, depending on store implementations
    // the routing is over and the is no currently ongoing routing process
    schedulers.process()
    schedulers.start()

    routingStatus = undefined
  }
}
