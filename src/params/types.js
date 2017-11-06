const casters = {
  n: Number,
  b: JSON.parse,
  s: String
}

export function toParamTypes (query) {
  const params = {}
  for (let key in query) {
    const value = query[key]
    const type = key[0]
    key = key.slice(2)
    const caster = casters[type]
    if (!caster) {
      console.error(`Invalid query type for '${key}': ${type}`)
      continue
    }
    params[key] = caster(value)
  }
  return params
}

export function toQueryTypes (params) {
  const query = {}
  for (let key in params) {
    const value = params[key]
    const type = (typeof value)[0]
    if (!(type in casters)) {
      console.error(`Invalid query type for '${key}': ${type}`)
      continue
    }
    query[`${type}_${key}`] = value
  }
  return query
}
