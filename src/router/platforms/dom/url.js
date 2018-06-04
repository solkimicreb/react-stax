import { toPathArray, toParams, toScroll } from '../../utils';
import { params, path, history } from '../../integrations';

Object.assign(params, toParams(location.search));
path.push(...toPathArray(location.pathname));

history.replace({
  path,
  params,
  scroll: toScroll(location.hash)
});
