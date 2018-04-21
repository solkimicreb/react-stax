import { Queue, priorities } from '@nx-js/queue-util';

export default typeof global === 'object' &&
  typeof global.process === 'object' &&
  !(global.navigator && global.navigator.product === 'ReactNative');

export const compScheduler = new Queue(priorities.SYNC);
export const scheduler = new Queue(priorities.SYNC);

const noop = () => null;

export const localStorage = {
  getItem: noop,
  setItem: noop
};

function updateUrl(state, title, url) {
  let tokens = url.split('?');
  location.pathname = tokens[0];
  location.search = tokens[1] ? `?${tokens[1]}` : '';
  tokens = location.search.split('#');
  location.hash = tokens[1] ? `#${tokens[1]}` : '';
}

export const history = {
  replaceState: updateUrl,
  pushState: updateUrl
};

export const location = {
  pathname: '',
  search: '',
  hash: ''
};

export const historyHandler = noop;
