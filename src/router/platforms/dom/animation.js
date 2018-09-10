import { animation } from '../../integrations'

Object.assign(animation, {
  enter,
  leave
})

function enter(container, enterAnimation, context) {
  // every router has a first child, even when no matcing page is found
  // the first child is always the current page node or a dummy node (if there is no matching page)
  const toDOM = container.children[0]
  if (toDOM) {
    return runAnimation(toDOM, enterAnimation, context)
  }
  return Promise.resolve()
}

function leave(container, leaveAnimation, context) {
  // routers might have a second child
  // the second child is always the previous (leaving) page node
  // it will be removed by the router after the animation is over
  const fromDOM = container.children[1]
  if (fromDOM) {
    return runAnimation(fromDOM, leaveAnimation, context)
  }
  return Promise.resolve()
}

function runAnimation(elem, animation, context) {
  const promise = animation(elem, context)
  if (!(promise instanceof Promise)) {
    throw new TypeError('Animations must return a promise')
  }
  return promise
}
