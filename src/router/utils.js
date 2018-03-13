import { Queue, priorities } from '@nx-js/queue-util'

export const scheduler = new Queue(priorities.LOW)

export function toPathArray (path) {
  return path.split('/').filter(notEmpty)
}

export function toPathString (path) {
  return '/' + path.filter(notEmpty).join('/')
}

export function toQuery (params) {
  const queryTokens = []

  for (let key in params) {
    let value = params[key]
    if (value !== undefined && value !== '') {
      key = encodeURIComponent(key)
      value = encodeURIComponent(JSON.stringify(value))
      queryTokens.push(`${key}=${value}`)
    }
  }
  return queryTokens.length ? '?' + queryTokens.join('&') : ''
}

export function toParams (queryString) {
  const queryTokens = queryString
    .slice(1)
    .split('&')
    .filter(notEmpty)

  const params = {}
  for (let token of queryTokens) {
    const keyValue = token.split('=')
    const key = decodeURIComponent(keyValue[0])
    const value = JSON.parse(decodeURIComponent(keyValue[1]))
    params[key] = value
  }
  return params
}

export function notEmpty (token) {
  return token !== ''
}

export function rethrow (fn) {
  return error => {
    fn()
    throw error
  }
}

export function clear (obj) {
  for (let key of Object.keys(obj)) {
    delete obj[key]
  }
}

export function defaults (obj, defaultProps) {
  for (let key in defaultProps) {
    if (obj[key] === undefined) {
      obj[key] = defaultProps[key]
    }
  }
}
