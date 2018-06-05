import { path, params, history, scroller, scheduler } from './integrations';
import { toPathString, toUrl, normalizePath } from './utils';

const routers = [];
let routingStatus;
const initStatuses = new Set();

// register a router at a given depth
export function registerRouter(router, depth) {
  // there can be multiple parallel routers at a given depth (we need a Set)
  if (!routers[depth]) {
    routers[depth] = new Set();
  }
  routers[depth].add(router);
  // route the newly added router, if we are not routing currently
  // or if the routing process is already past the current depth
  // this may happen if the router is not added because of the routing process
  // but was hidden some by conditional or lazy loading for example
  if (!routingStatus || depth <= routingStatus.depth) {
    initRouter(router, depth);
  }
}

// router newly added routers even if there is no ongoing routing process
function initRouter(router, depth) {
  const status = { depth, cancelled: false };
  initStatuses.add(status);

  return Promise.resolve()
    .then(() => router.startRouting())
    .then(
      // cancel the routing if a new routing started in the meantime
      resolvedData => !status.cancelled && router.finishRouting(resolvedData)
    )
    .then(() => initStatuses.delete(status));
}

// release routers on componentWillUnmount
export function releaseRouter(router, depth) {
  routers[depth].delete(router);
}

// this is part of the public API, it triggers root level routings
export function route(args) {
  routeFromDepth(args, 0);
}

// this cancels ongoing routings and recursively routes all routers
export function routeFromDepth(
  {
    to = toPathString(path),
    params: toParams = {},
    scroll,
    push,
    inherit
  } = {},
  depth = 0
) {
  const { depth: normalizedDepth, normalizedPath } = normalizePath(to, depth);
  depth = normalizedDepth;

  // there may be routers which route outside of the standard routing process
  // for example a router was added by lazy loading and does its initial routing
  // cancel routings for these routers
  initStatuses.forEach(status => (status.cancelled = depth <= status.depth));
  // cancel the standard ongoing routing process if there is one
  if (routingStatus) {
    routingStatus.cancelled = true;
  } else {
    // flush the pending low priority URL changes to have a consistent state before starting a new routing
    // only flush it if there is no ongoing routing
    // otherwise the old and new routing should be treated in one batch to avoid flicker
    scheduler.process();
  }
  // stop the URL updating scheduler until the end of the routing
  // and commit all URL updates in one batch to avoid flicker
  scheduler.stop();

  // create a new routing status
  // this may be cancelled by future routing processes
  routingStatus = { depth, cancelled: false };

  // update the path array with the desired new path
  path.splice(depth, Infinity, ...normalizedPath);
  // replace or extend the query params with the new params
  // only mutate the params object, never replace it (because it is an observable)
  if (!inherit) {
    Object.keys(params).forEach(key => delete params[key]);
  }
  Object.assign(params, toParams);

  // recursively route all routers, then finish the routing
  return Promise.resolve()
    .then(() => switchRoutersFromDepth(depth, routingStatus))
    .then(() => finishRouting({ push, scroll }, routingStatus));
}

// this recursively routes all parallel routers form a given depth
// all routers are finished routing at a depth before continuing with the next depth
function switchRoutersFromDepth(depth, status) {
  const routersAtDepth = Array.from(routers[depth] || []);

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
        .then(() => switchRoutersFromDepth(++depth, status))
    );
  }
}

// do the first routing half if the routing is not cancelled
// it includes data resolving, interception and lazy loading
function startRoutingAtDepth(routersAtDepth, status) {
  if (!status.cancelled) {
    return Promise.all(routersAtDepth.map(router => router.startRouting()));
  }
}

// do the second routing half if the routing is not cancelled
// it includes rendering and animation
function finishRoutingAtDepth(routersAtDepth, resolvedData, status) {
  if (!status.cancelled) {
    return Promise.all(
      routersAtDepth.map((router, i) => router.finishRouting(resolvedData[i]))
    );
  }
}

// all routers updated recursively by now, it is time to finish the routing
// if it was not cancelled in the meantime
function finishRouting({ push, scroll }, status) {
  if (!status.cancelled) {
    const prevPath = history.items[history.idx].path;
    const pathChanged = toPathString(prevPath) !== toPathString(path);
    // push a new history item or replace the current one
    // maybe also add scroll
    if (push === true || (push !== false && pathChanged)) {
      const url = toUrl({ path, params, scroll });
      history.push({ path, params, scroll, url });
    }
    // handle the scroll after the whole routing is over
    // this makes sure that the necessary elements are already rendered
    // in case of a scrollToAnchor behavior
    if (typeof scroll === 'object') {
      if (scroll.anchor) {
        scroller.scrollToAnchor(scroll);
      } else {
        scroller.scrollToLocation(scroll);
      }
    } else if (scroll !== false && pathChanged) {
      scroller.scrollToLocation({ top: 0, left: 0 });
    }

    // flush the URL updates in one batch and restart the automatic processing
    // it is important to call this after handleHistory()
    // in case of a newly pushed history item, the flushed URL changes
    // should replace the new item instead of the old one
    scheduler.process();
    scheduler.start();
    // the routing is over and the is no currently ongoing routing process
    routingStatus = undefined;
  }
}
