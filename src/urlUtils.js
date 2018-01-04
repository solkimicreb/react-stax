// pathToPageNames
export function normalizePath (path, depth) {
  let tokens = path.split('/')

  // an absolute path
  if (tokens[0] === '') {
    return tokens.slice(1)
  }

  // remove '.' tokens
  tokens = tokens.filter(notInPlace)

  let parentTokensAllowed = true
  // remove empty tokens
  const result = location.pathname.split('/').filter(notEmpty)

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


export function toPages (path) {
  return path.split('/').filter(notEmpty)
}

export function toPath (pages) {
  return '/' + pages.filter(notEmpty).join('/')
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

function notInPlace (token) {
  return token !== '.'
}

export function notEmpty (token) {
  return token !== ''
}

export function clear (obj) {
  if (Array.isArray(obj)) {
    obj.length = 0
  } else {
    for (let key of Object.keys(obj)) {
      delete obj[key]
    }
  }
}
