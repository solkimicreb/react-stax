export let params = history.state

export function setParams (newParams) {
  params = newParams
}

export function getParams () {
  return params
}
