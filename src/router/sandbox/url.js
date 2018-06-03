import { observable, observe } from '@nx-js/observer-util';
import { scheduler } from './scheduler';
import { history } from './history';
import { toQuery, toParams, toPathArray, toPathString } from '../utils';

export const params = observable({});
export const path = observable([]);

// auto sync the params object with the query params
// and the path array with the URL pathname
function syncUrl() {
  // TODO: I had to remove + location.hash
  const pathname = toPathString(path);
  const search = toQuery(params);
  const url = pathname + search;
  // do not push new history items for automatic updates
  // this is meant to keep the URL in sync with the params during parameter changes
  // in a single page, not to add new logical history blocks
  history.items[history.idx - 1] = { pathname, search, url };
}
observe(syncUrl, { scheduler });
