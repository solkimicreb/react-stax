import { updateLinks } from './core'
import { getParams } from 'react-easy-params'

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
    setPath(tokens)
    // maybe it makes sense to throttle this!
    // some stuff is removed, some it added -> no need to rush with the links
    updateLinks(tokens)
  }
}

export function trimPathTokens (depth) {
  const tokens = location.pathname.split('/')
  if (tokens.length > depth + 1) {
    tokens.length = depth + 1
    setPath(tokens)
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
    const queryParams = getParams(Object.keys(linkParams))
    for (let param in linkParams) {
      if (linkParams[param] !== queryParams[param]) {
        return false
      }
    }
  }
  return true
}

export function getPath () {
  return location.pathname.split('/')
}

export function setPath (tokens) {
  const path = tokens.join('/')
  const url = path + location.search + location.hash
  history.replaceState(history.state, '', url)
}
