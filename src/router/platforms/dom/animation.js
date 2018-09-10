import { animation } from '../../integrations'

Object.assign(animation, {
  enter,
  leave
})

function enter(container, enterAnimation, context, hasBoth) {
  const toDOM = hasBoth ? container.children[1] : container.children[0]
  return runAnimation(toDOM, enterAnimation, context)
}

// TODO: somehow decide if the children are entering or leaving nodes
function leave(container, leaveAnimation, context) {
  const fromDOM = container.children[0]
  return runAnimation(fromDOM, leaveAnimation, context)
}

function runAnimation(elem, animation, context) {
  const promise = animation(elem, context)
  if (!(promise instanceof Promise)) {
    throw new TypeError('Animations must return a promise')
  }
  return promise
}
