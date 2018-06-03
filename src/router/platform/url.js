import { observable, observe } from '@nx-js/observer-util';
import { scheduler } from './scheduler';
import { toQuery, toParams, toPathArray, toPathString } from '../utils';
import { params, path } from '../integrations';

Object.assign(params, toParams(location.search));
path.push(...toPathArray(location.pathname));

// auto sync the params object with the query params
// and the path array with the URL pathname
function syncUrl() {
  const url = toPathString(path) + toQuery(params) + location.hash;
  // do not push new history items for automatic updates
  // this is meant to keep the URL in sync with the params during parameter changes
  // in a single page, not to add new logical history blocks
  history.replaceState(history.state, '', url);
}
observe(syncUrl, { scheduler });
