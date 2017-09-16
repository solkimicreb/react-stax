import { updateLinks } from './core'

export function normalizePath (path, depth) {
  let tokens = path.split('/')

  // an absolute path
  if (tokens[0] === '') {
    return tokens
  }

  // remove '.' tokens
  tokens = tokens.filter(notInPlace)

  let parentTokensAllowed = true
  const result = location.pathname.split('/')

  for (let token of tokens) {
    if (depth < 0) {
      throw new Error(`Malformed path: ${path}, too many '..' tokens.`)
    }
    if (token === '') {
      throw new Error(`Malformed path: ${path}, can not contain empty tokens.`)
    }
    if (token === '..') {
      if (!parentTokensAllowed) {
        throw new Error(
          `Malformed path: ${path}, '..' tokens are only allowed at the beginning.`
        )
      }
      depth--
    } else {
      result[depth] = token
      parentTokensAllowed = false
      depth++
    }
  }

  result.length = depth
  return result
}

function notInPlace (token) {
  return token !== '.'
}

export function updatePathToken (newToken, depth) {
  const tokens = location.pathname.split('/')
  const oldToken = tokens[depth + 1]
  if (oldToken !== newToken) {
    tokens[depth + 1] = newToken
    history.replaceState(history.state, '', createUrl(tokens))
    // maybe it makes sense to throttle this!
    // some stuff is removed, some it added -> no need to rush with the links
    updateLinks(tokens)
  }
}

export function trimPathTokens (depth) {
  const tokens = location.pathname.split('/')
  if (tokens.length > depth + 1) {
    tokens.length = depth + 1
    history.replaceState(history.state, '', createUrl(tokens))
    updateLinks(tokens)
  }
}

export function isLinkActive (linkTokens, linkParams) {
  if (linkTokens) {
    const pathTokens = location.pathname.split('/')
    for (let i = 0; i < linkTokens.length; i++) {
      if (linkTokens[i] !== pathTokens[i]) {
        return false
      }
    }
  }
  if (linkParams) {
    const queryParams = toParams(location.search)
    for (let param in linkParams) {
      if (linkParams[param] !== queryParams[param]) {
        return false
      }
    }
  }
  return true
}

function createUrl (tokens) {
  return tokens.join('/') + location.search + location.hash
}

export function toQuery (params) {
  const tokens = []
  for (let key in params) {
    const value = params[key]
    if (value !== undefined) {
      tokens.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }
  return tokens.length ? '?' + tokens.join('&') : ''
}

export function toParams (query) {
  const tokens = query
    .slice(1)
    .split('&')
    .filter(notEmpty)
  const params = {}
  for (let token of tokens) {
    const keyValue = token.split('=')
    params[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1])
  }
  return params
}

function notEmpty (string) {
  return string !== ''
}
