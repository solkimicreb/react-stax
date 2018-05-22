import { Queue, priorities } from '@nx-js/queue-util';
import { isNode } from '../utils';

export default new Queue(isNode ? priorities.SYNC : priorities.LOW);
