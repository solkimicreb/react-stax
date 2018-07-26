import { path, params, history, scroller } from './integrations';
import { toPathString, normalizePath } from './utils';
import * as schedulers from '../schedulers';

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
    schedulers.integrations.process();
  }
  // stop all schedulers until the end of the routing and commit them at once
  // this includes state based view updates, URL updates and localStorag updats
  // having view updates during the routing can cause flickers
  // because of the random onRoute data resolve timings, it is nicer to commit everything at once
  schedulers.stop();

  // create a new routing status
  // this may be cancelled by future routing processes
  const status = (routingStatus = { depth, cancelled: false });

  // update the path array with the desired new path
  // and save the old path for comparison at the end of the routing
  const fromPath = Array.from(path);
  path.splice(depth, Infinity, ...normalizedPath);

  // replace or extend the query params with the new params
  // and save the old params for later comparision in the routing hooks
  const fromParams = Object.assign({}, params);
  // only mutate the params object, never replace it (because it is an observable)
  if (!inherit) {
    Object.keys(params).forEach(key => delete params[key]);
  }
  Object.assign(params, toParams);

  // recursively route all routers, then finish the routing
  return Promise.resolve()
    .then(() =>
      switchRoutersFromDepth(
        { scroll, push, inherit, fromParams },
        depth,
        status
      )
    )
    .then(() => finishRouting({ scroll, push, fromPath }, status));
}

// this recursively routes all parallel routers form a given depth
// all routers are finished routing at a depth before continuing with the next depth
function switchRoutersFromDepth(context, depth, status) {
  const routersAtDepth = Array.from(routers[depth] || []);

  if (routersAtDepth.length) {
    return (
      Promise.resolve()
        // during the first routing half, the user may intercept the routing
        // and cancel it by triggering a new routing
        // we have to wait for all routers before we can go on
        // to make sure the routing was not cancelled
        .then(() => startRoutingAtDepth(routersAtDepth, context, status))
        // after all routers finished the first half, all of them does the second half
        .then(resolvedData =>
          finishRoutingAtDepth(routersAtDepth, context, resolvedData, status)
        )
        // all routers finished routing at this depth, go on with the next depth
        .then(() => switchRoutersFromDepth(++depth, status))
    );
  }
}

// do the first routing half if the routing is not cancelled
// it includes data resolving, interception and lazy loading
function startRoutingAtDepth(routersAtDepth, context, status) {
  if (!status.cancelled) {
    return Promise.all(
      routersAtDepth.map(router => router.startRouting(context))
    );
  }
}

// do the second routing half if the routing is not cancelled
// it includes rendering and animation
function finishRoutingAtDepth(routersAtDepth, context, resolvedData, status) {
  if (!status.cancelled) {
    return Promise.all(
      routersAtDepth.map((router, i) =>
        router.finishRouting(context, resolvedData[i])
      )
    );
  }
}

// all routers updated recursively by now, it is time to finish the routing
// if it was not cancelled in the meantime
function finishRouting({ scroll, push, fromPath }, status) {
  if (!status.cancelled) {
    const pathChanged = toPathString(path) !== toPathString(fromPath);
    // push a new history item when necessary
    // it is important to do this before restarting the schedulers
    // to apply all new history replace operations to the new item
    if (push === true || (push !== false && pathChanged)) {
      history.push({ path, params, scroll });
    }

    // handle the scroll after the whole routing is over
    // this makes sure that the necessary elements are already rendered
    // in case of a scrollToAnchor behavior
    if (typeof scroll === 'object') {
      scroller.scrollTo(scroll);
      // TODO: something is bad! -> code gets here before the visual updte
    } else if (pathChanged) {
      scroller.scrollTo({ top: 0, left: 0 });
    }

    // flush the URL updates in one batch and restart the automatic processing
    // it is important to call this after handleHistory()
    // in case of a newly pushed history item, the flushed URL changes
    // should replace the new item instead of the old one
    // also flush the view updates
    schedulers.process();
    schedulers.start();
    // the routing is over and the is no currently ongoing routing process
    routingStatus = undefined;
  }
}
