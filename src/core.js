import { trimPathTokens } from './urlUtils'
import { nextTick } from '@nx-js/observer-util'
import pushState from 'history-throttler'
import { routeParams } from 'react-easy-params'

// later allow parallel routing, improve structure
export const routers = {}
export const links = new Set()

export function registerRouter(router, depth) {
  let routersAtDepth = routers[depth]
  if (!routersAtDepth) {
    routersAtDepth = routers[depth] = new Set()
  }
  routersAtDepth.add(router)
}

export function releaseRouter(router, depth) {
  const routersAtDepth = routers[depth]

  routersAtDepth.delete(router)
  if (!routersAtDepth.size) {
    trimPathTokens(depth)
  }
}

export function route(tokens, params) {
  pushState(undefined, '')
  if (tokens) {
    routePath(tokens)
  }
  if (params) {
    routeParams(params)
  }
}

function routePath(tokens) {
  tokens = tokens.slice(1)
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const routersAtDepth = routers[i]
    if (routersAtDepth) {
      routersAtDepth.forEach(router => router.route(token))
    }
  }
}

export function updateLinks(tokens) {
  // later throttle
  // can be removed later i guees
  nextTick(() => {
    for (let link of links) {
      link.updateActivity(tokens)
    }
  })
}

window.addEventListener('popstate', () => {
  const tokens = location.pathname.split('/')
  routePath(tokens)
  updateLinks()
})
