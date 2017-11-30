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

export function getPages () {
  return location.pathname.split('/').filter(notEmpty)
}

function notInPlace (token) {
  return token !== '.'
}

export function notEmpty (token) {
  return token !== ''
}
