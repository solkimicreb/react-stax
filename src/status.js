let IS_ROUTING = false

export function startRouting () {
  IS_ROUTING = true
}

export function stopRouting () {
  IS_ROUTING = false
}

export function isRouting () {
  return IS_ROUTING
}
