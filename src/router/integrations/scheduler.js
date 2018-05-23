import { Queue, priorities } from '@nx-js/queue-util';
import { isNode } from '../utils';

// commit reactions synchronously in NodeJS
// it is better for both SSR and testing
// commit them with a low priority in the browser
// URL updates are not something the user is actively waiting for
export default new Queue(isNode ? priorities.SYNC : priorities.LOW);
