import { Queue, priorities } from '@nx-js/queue-util';

// run state change reactions synchronously
// TODO: add batching in certain cases
export const state = new Queue(priorities.SYNC);

// run integration reactions with a low priority
// URL and storage updates are not something the user is eagerly waiting for
export const integrations = new Queue(priorities.LOW);

export function stop() {
  state.stop();
  integrations.stop();
}

export function start() {
  state.start();
  integrations.start();
}

export function process() {
  state.process();
  integrations.process();
}
