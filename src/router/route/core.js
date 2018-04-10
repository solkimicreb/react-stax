import { path, params } from '../integrations';
import { integrationScheduler, location, history, historyHandler } from 'env';
import { toPathArray, toPathString, toParams, rethrow, clear } from '../utils';

const routers = [];
let routingStatus;
let initStatus;

class RoutingStatus {
  check(fn) {
    return () => (this.cancelled ? undefined : fn());
  }
}

export function registerRouter(router, depth) {
  if (routers[depth]) {
    throw new Error('Parallel routers are not supported.');
  }
  routers[depth] = router;
  // route the router if we are not routing currently
  if (!routingStatus) {
    initStatus = initStatus || new RoutingStatus();

    const oldParams = Object.assign({}, params);
    router.update(path[depth], path[depth], oldParams, initStatus);
  }
}

export function releaseRouter(router, depth) {
  routers.splice(depth, Infinity);
}

export function route({ to, params, options }) {
  routeFromDepth(to, params, options, 0);
}

export function routeFromDepth(
  toPath = location.pathname,
  newParams = {},
  options = {},
  depth = 0
) {
  // cancel inits
  if (initStatus) {
    initStatus.cancelled = true;
    initStatus = undefined;
  }
  if (routingStatus) {
    routingStatus.cancelled = true;
  } else {
    // only process if we are not yet routing to prevent mid routing flash!
    integrationScheduler.process();
  }
  const status = (routingStatus = new RoutingStatus());
  integrationScheduler.stop();

  // replace or extend params with nextParams by mutation (do not change the observable ref)
  const oldParams = Object.assign({}, params);
  if (!options.inherit) {
    clear(params);
  }
  Object.assign(params, newParams);

  const fromPath = path.slice();
  toPath = path.slice(0, depth).concat(toPathArray(toPath));
  path.splice(depth, Infinity);

  return switchRoutersFromDepth(
    fromPath,
    toPath,
    depth,
    status,
    oldParams
  ).then(
    status.check(() => onRoutingEnd(options, depth)),
    rethrow(status.check(() => onRoutingEnd(options, depth)))
  );
}

function switchRoutersFromDepth(fromPath, toPath, depth, status, oldParams) {
  const router = routers[depth];

  if (!router) {
    return Promise.resolve();
  }

  // maybe add status checks here for cancellation
  return router
    .update(fromPath[depth], toPath[depth], oldParams, status)
    .then(
      status.check(() =>
        switchRoutersFromDepth(fromPath, toPath, ++depth, status, oldParams)
      )
    );
}

function onRoutingEnd(options) {
  // by default a history item is pushed if the pathname changes!
  if (
    options.history === true ||
    (options.history !== false && toPathString(path) !== location.pathname)
  ) {
    history.pushState(options, '');
  } else {
    history.replaceState(options, '');
  }

  integrationScheduler.process();
  integrationScheduler.start();
}

historyHandler(() =>
  route({
    to: location.pathname,
    params: toParams(location.search),
    options: { history: false }
  })
);
