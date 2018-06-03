import { Queue, priorities } from '@nx-js/queue-util';

// commit reactions with a low priority in the browser
// URL updates are not something the user is eagerly waiting for
export const scheduler = new Queue(priorities.LOW);
