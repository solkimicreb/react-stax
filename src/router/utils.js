const emptyTokens = new Set([undefined, '', '.']);
const notEmpty = token => !emptyTokens.has(token);

export function normalizePath(path = '', depth) {
  const normalizedPath = [];
  for (let token of toPathArray(path)) {
    if (token === '..') {
      depth--;
    } else if (notEmpty(token)) {
      normalizedPath.push(token);
    }
  }

  return {
    normalizedPath,
    depth: path[0] === '/' ? 0 : depth
  };
}

// convert pathname strings to arrays
export function toPathArray(path = '') {
  return path.split('/').filter(notEmpty);
}

// convert path arrays to absolute pathname strings
export function toPathString(path = []) {
  // the leading '/' is important, it differentiates absolute pathnames from relative ones
  return '/' + path.filter(notEmpty).join('/');
}

// convert params objects to query strings
export function toQuery(params = {}) {
  const tokens = [];

  for (let key in params) {
    let value = params[key];
    if (notEmpty(value)) {
      key = encodeURIComponent(key);
      // JSON stringify the value to keep the type information
      value = encodeURIComponent(JSON.stringify(value));
      tokens.push(`${key}=${value}`);
    }
  }
  return tokens.length ? `?${tokens.join('&')}` : '';
}

// converts &key=value strings to objects
export function toParams(queryString = '') {
  const queryTokens = queryString
    // remove the leading ? or # character
    .slice(1)
    .split('&')
    .filter(notEmpty);

  const params = {};
  for (let token of queryTokens) {
    const keyValue = token.split('=');
    const key = decodeURIComponent(keyValue[0]);
    // JSON.stringify and parse keeps the type information
    const value = JSON.parse(decodeURIComponent(keyValue[1]));
    params[key] = value;
  }
  return params;
}

// convert scroll anchor to URL hash
export function toHash(scroll = {}) {
  return scroll && scroll.anchor ? `#${scroll.anchor}` : '';
}

// convert url hash to scroll anchor
export function toScroll(hash) {
  return hash ? { anchor: hash.slice(1) } : {};
}

export function toUrl({ path, params, scroll }) {
  return toPathString(path) + toQuery(params) + toHash(scroll);
}

// augments the props with extraProps, which are not in excludeProps
// nice for proxying irrelevant props to the underlying DOM element
export function addExtraProps(props, extraProps, excludeProps) {
  for (let key in extraProps) {
    if (!(key in excludeProps)) {
      props[key] = extraProps[key];
    }
  }
  return props;
}
