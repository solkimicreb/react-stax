import { path, params } from '../integrations';
import { integrationScheduler, location, history, historyHandler } from 'env';
import {
  toPathArray,
  toPathString,
  toParams,
  toHash,
  rethrow,
  clear
} from '../utils';

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
      .then(() => router.route1(path[depth], oldParams))
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
  path.splice(depth, Infinity, ...toPathArray(toPath));

  // how should these behave with history and url?
  // do this at the beginning of the routing to look nice with nested async routing
  // issue! -> scroll.to element might not yet be visible!!
  options.scroll = options.scroll || toParams(location.hash);

  return switchRoutersFromDepth(fromPath, depth, status, oldParams).then(
    () => onRoutingEnd(options, status),
    rethrow(() => onRoutingEnd(options, status))
  );
}

function switchRoutersFromDepth(fromPath, depth, status, oldParams) {
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
            router.route1(fromPath[depth], oldParams)
          )
        )
    )
    .then(
      resolvedData =>
        !status.cancelled &&
        Promise.all(
          routersAtDepth.map((router, i) =>
            router.route2(fromPath[depth], resolvedData[i])
          )
        )
    )
    .then(() => switchRoutersFromDepth(fromPath, ++depth, status, oldParams));
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
    // do I want to push options as the state? I should add it to the hash instead probably
    history.pushState(options, '', toHash(options.scroll));
  } else {
    history.replaceState(options, '', toHash(options.scroll));
  }

  if (options.scroll && options.scroll.to) {
    const scrollAnchor = document.getElementById(options.scroll.to);
    if (scrollAnchor) {
      scrollAnchor.scrollIntoView(options.scroll);
    }
  }
  // issue if i put this to the beginning it is messed up
  // but putting this at the end 'scrolls late', it scrolls after potential renders
  if (options.scroll && !options.scroll.to) {
    window.scrollTo(options.scroll);
  }

  integrationScheduler.process();
  integrationScheduler.start();
  routingStatus = undefined;
}

historyHandler(() =>
  route({
    to: location.pathname,
    params: toParams(location.search),
    options: { history: false, scroll: toParams(location.hash) }
  })
);
