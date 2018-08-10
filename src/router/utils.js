const emptyTokens = new Set([undefined, '', '.'])
const notEmpty = token => !emptyTokens.has(token)

export function normalizePath(fromPath, toPath = '', depth) {
  const normalizedPath = []
  for (let token of toPathArray(toPath)) {
    if (token === '..') {
      depth--
    } else if (notEmpty(token)) {
      normalizedPath.push(token)
    }
  }

  if (toPath[0] === '/') {
    return normalizedPath
  }
  return fromPath.slice(0, depth).concat(normalizedPath)
}

// convert pathname strings to arrays
export function toPathArray(path = '') {
  return path.split('/').filter(notEmpty)
}

// convert path arrays to absolute pathname strings
export function toPathString(path = []) {
  // the leading '/' is important, it differentiates absolute pathnames from relative ones
  return '/' + path.filter(notEmpty).join('/')
}

// convert params objects to query strings
export function toQuery(params = {}) {
  const tokens = []

  for (let key in params) {
    let value = params[key]
    if (notEmpty(value)) {
      key = encodeURIComponent(key)
      // JSON stringify the value to keep the type information
      value = encodeURIComponent(JSON.stringify(value))
      tokens.push(`${key}=${value}`)
    }
  }
  return tokens.length ? `?${tokens.join('&')}` : ''
}

// converts &key=value strings to objects
export function toParams(queryString = '') {
  const queryTokens = queryString
    // remove the leading ? or # character
    .slice(1)
    .split('&')
    .filter(notEmpty)

  const params = {}
  for (let token of queryTokens) {
    const keyValue = token.split('=')
    const key = decodeURIComponent(keyValue[0])
    // JSON.stringify and parse keeps the type information
    const value = JSON.parse(decodeURIComponent(keyValue[1]))
    params[key] = value
  }
  return params
}

// convert scroll anchor to URL hash
export function toHash(scroll = {}) {
  return scroll.anchor ? `#${scroll.anchor}` : ''
}

// convert url hash to scroll anchor
export function toScroll(hash) {
  return hash ? { anchor: hash.slice(1) } : undefined
}

// convert object to url
export function toUrl({ path, params, scroll }) {
  return toPathString(path) + toQuery(params) + toHash(scroll)
}

// convert url to object
export function toObject(url) {
  let queryIndex = url.indexOf('?')
  queryIndex = queryIndex === -1 ? Infinity : queryIndex
  let hashIndex = url.indexOf('#')
  hashIndex = hashIndex === -1 ? Infinity : hashIndex

  return {
    path: toPathArray(url.slice(0, queryIndex)),
    params: toParams(url.slice(queryIndex, hashIndex)),
    scroll: toScroll(url.slice(hashIndex))
  }
}

// augments the props with extraProps, which are not in excludeProps
// nice for proxying irrelevant props to the underlying DOM element
export function addExtraProps(props, extraProps, excludeProps) {
  for (let key in extraProps) {
    if (!(key in excludeProps)) {
      props[key] = extraProps[key]
    }
  }
  return props
}
