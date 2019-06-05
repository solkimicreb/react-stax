// augments the props with extraProps, which are not in excludeProps
// nice for proxying irrelevant props to the underlying DOM element
export function addExtraProps (props, extraProps, excludeProps) {
  for (let key in extraProps) {
    if (!(key in excludeProps)) {
      props[key] = extraProps[key]
    }
  }
  return props
}

// replace the data inside obj with the new data with mutations
// useful for 'replacing' observables while keeping the original reference
export function replace (obj, data) {
  if (Array.isArray(obj)) {
    obj.splice(0, Infinity, ...data)
  } else {
    Object.keys(obj).forEach(key => delete obj[key])
    Object.assign(obj, data)
  }
}
