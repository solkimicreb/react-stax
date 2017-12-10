export function toQuery (params) {
  const queryTokens = []

  for (let key in params) {
    const value = params[key]
    if (value !== undefined && value !== '') {
      queryTokens.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`)
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
    params[decodeURIComponent(keyValue[0])] = JSON.parse(decodeURIComponent(keyValue[1]))
  }
  return params
}

function notEmpty (string) {
  return string !== ''
}
