import { path, params } from '../integrations';
import { integrationScheduler, location, history, historyHandler } from 'env';
import { toPathArray, toPathString, toParams, rethrow, clear } from '../utils';

const routers = [];
let routingStatus;
const initStatuses = new Set();

export function registerRouter(router, depth) {
  if (!routers[depth]) {
    routers[depth] = new Set();
  }
  routers[depth].add(router);
  // route the router if we are not routing currently
  // or the routing is already past the current depth
  if (!routingStatus || depth <= routingStatus.depth) {
    const status = { depth, cancelled: false };
    initStatuses.add(status);

    const oldParams = Object.assign({}, params);
    Promise.resolve()
      .then(() => router.route1(path[depth], path[depth], oldParams))
      .then(
        resolvedData =>
          !status.cancelled && router.route2(path[depth], resolvedData)
      )
      .then(() => initStatuses.delete(status));
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
    initStatuses.forEach(status => {
      if (depth <= status.depth) {
        status.cancelled = true;
      }
    });
  }
  if (routingStatus) {
    routingStatus.cancelled = true;
  } else {
    // only process if we are not yet routing to prevent mid routing flash!
    integrationScheduler.process();
  }
  const status = (routingStatus = { depth, cancelled: false });
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
    () => onRoutingEnd(options, status),
    rethrow(() => onRoutingEnd(options, status))
  );
}

function switchRoutersFromDepth(fromPath, toPath, depth, status, oldParams) {
  const routersAtDepth = Array.from(routers[depth] || []);

  if (!routersAtDepth.length || status.cancelled) {
    return Promise.resolve();
  }

  return Promise.resolve()
    .then(
      () =>
        !status.cancelled &&
        Promise.all(
          routersAtDepth.map(router =>
            router.route1(fromPath[depth], toPath[depth], oldParams)
          )
        )
    )
    .then(
      resolvedData =>
        !status.cancelled &&
        Promise.all(
          routersAtDepth.map((router, i) =>
            router.route2(toPath[depth], resolvedData[i])
          )
        )
    )
    .then(() =>
      switchRoutersFromDepth(fromPath, toPath, ++depth, status, oldParams)
    );
}

function onRoutingEnd(options, status) {
  if (status.cancelled) {
    return;
  }
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
  routingStatus = undefined;
}

historyHandler(() =>
  route({
    to: location.pathname,
    params: toParams(location.search),
    options: { history: false }
  })
);
