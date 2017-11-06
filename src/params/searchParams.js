import { toQueryTypes, toParamTypes } from './types'

export function toQuery (params) {
  const query = toQueryTypes(params)
  const queryTokens = []

  for (let key in query) {
    const value = query[key]
    if (value !== undefined && value !== '') {
      queryTokens.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
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
    params[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1])
  }
  return toParamTypes(params)
}

function notEmpty (string) {
  return string !== ''
}
