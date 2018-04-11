import { path, params } from '../integrations';
import { integrationScheduler, location, history, historyHandler } from 'env';
import { toPathArray, toPathString, toParams, rethrow, clear } from '../utils';

const routers = [];
let routingStatus;
let initStatuses = [];

// this is pretty bad, there can be multiple arguments
// replace this with context and if checks
class RoutingStatus {
  check(fn) {
    return arg => (this.cancelled ? undefined : fn(arg));
  }
}

export function registerRouter(router, depth) {
  if (!routers[depth]) {
    routers[depth] = new Set();
  }
  routers[depth].add(router);
  // route the router if we are not routing currently
  if (!routingStatus) {
    const status = new RoutingStatus();
    initStatuses.push(status);

    const oldParams = Object.assign({}, params);
    Promise.resolve()
      .then(
        status.check(() => router.route1(path[depth], path[depth], oldParams))
      )
      .then(
        status.check(resolvedData => router.route2(path[depth], resolvedData))
      );
  }
}

export function releaseRouter(router, depth) {
  routers[depth].delete(router);
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
  if (initStatuses.length) {
    initStatuses.forEach(status => (status.cancelled = true));
    initStatuses = [];
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
  const routersAtDepth = Array.from(routers[depth] || []);

  if (!routersAtDepth.length) {
    return Promise.resolve();
  }

  return Promise.resolve()
    .then(
      status.check(() =>
        Promise.all(
          routersAtDepth.map(router =>
            router.route1(fromPath[depth], toPath[depth], oldParams)
          )
        )
      )
    )
    .then(
      status.check(resolvedData =>
        Promise.all(
          routersAtDepth.map((router, i) =>
            router.route2(toPath[depth], resolvedData[i])
          )
        )
      )
    )
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
