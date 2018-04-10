import React from 'react';
import { Queue, priorities } from '@nx-js/queue-util';
import isNode, * as node from './node';

export const compScheduler = isNode
  ? node.compScheduler
  : new Queue(priorities.SYNC);
export const integrationScheduler = isNode
  ? node.integrationScheduler
  : new Queue(priorities.LOW);

export const localStorage = isNode ? node.localStorage : window.localStorage;
export const history = isNode ? node.history : window.history;
export const location = isNode ? node.location : window.location;
export const historyHandler = isNode
  ? node.historyHandler
  : handler => window.addEventListener('popstate', handler);
export const anchor = 'a';
export const div = 'div';
export const normalizeProps = props => props;

export function animate(options, container) {
  // this is required for Safari and Firefox, but messes up Chrome in some cases
  options.fill = 'both';
  const animation = container.animate(options.keyframes, options);
  return new Promise(resolve => (animation.onfinish = resolve));
}
