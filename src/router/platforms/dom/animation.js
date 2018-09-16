import { animation } from '../../integrations'

Object.assign(animation, {
  enter,
  leave
})

function enter(container, enterAnimation, context, hasLeaving) {
  const toNode = container.children[hasLeaving ? 1 : 0]
  return runAnimation(toNode, enterAnimation, context)
}

function leave(container, leaveAnimation, context) {
  const fromNode = container.children[0]
  return runAnimation(fromNode, leaveAnimation, context)
}

function runAnimation(elem, animation, context) {
  const promise = animation(elem, context)
  if (!(promise instanceof Promise)) {
    throw new TypeError('Animations must return a promise')
  }
  return promise
}
