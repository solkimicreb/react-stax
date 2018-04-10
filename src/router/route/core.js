import { path, params } from '../integrations';
import { integrationScheduler, location, history, historyHandler } from 'env';
import { toPathArray, toPathString, toParams, rethrow, clear } from '../utils';

const routers = [];
let routingStatus;
let initStatuses = [];

class RoutingStatus {
  check(fn) {
    return () => (this.cancelled ? undefined : fn());
  }
}

export function registerRouter(router, depth) {
  routers[depth] = router;
  // route the router if we are not routing currently
  if (!routingStatus) {
    const status = new RoutingStatus();
    initStatuses.push(status);

    const oldParams = Object.assign({}, params);
    Promise.resolve()
      .then(() => router.init(path[depth], path[depth], oldParams))
      .then(toChild => router.resolve(toChild, status))
      .then(nextState => router.switch(nextState, status, {}));
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
  toPath = path.slice(0, depth).concat(toPathArray(toPath));

  return switchRoutersFromDepth(toPath, depth, status, oldParams).then(
    status.check(() => onRoutingEnd(options)),
    rethrow(status.check(() => onRoutingEnd(options)))
  );
}

function switchRoutersFromDepth(toPath, depth, status, oldParams) {
  const router = routers[depth];

  if (!router) {
    return Promise.resolve();
  }

  // maybe add status checks here for cancellation
  return router
    .init(path[depth], toPath[depth], oldParams)
    .then(child => router.resolve(child, status))
    .then(state => router.switch(state, status))
    .then(
      status.check(() =>
        switchRoutersFromDepth(toPath, ++depth, status, oldParams)
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

// issue -> it should take the state I was transitioned from (the next state)
// if I am going forward nextState.animate
// else prevState.animate
historyHandler(() =>
  route({
    to: location.pathname,
    params: toParams(location.search),
    options: { history: false }
  })
);
