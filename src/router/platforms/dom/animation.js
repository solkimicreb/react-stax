import { animation } from '../../integrations'

const FROM_DOM = Symbol('from DOM')
const TO_DOM = Symbol('to DOM')

Object.assign(animation, {
  setup,
  enter,
  leave
})

function setup(container) {
  cleanup(container)
  container[FROM_DOM] = container.firstElementChild
}

function enter(container, enterAnimation, context) {
  const toDOM = (container[TO_DOM] = container.firstElementChild)
  if (enterAnimation && toDOM) {
    return runAnimation(toDOM, enterAnimation, context)
  }
}

function leave(container, leaveAnimation, context) {
  let fromDOM = container[FROM_DOM]
  const toDOM = (container[TO_DOM] = container.firstElementChild)

  if (leaveAnimation && fromDOM) {
    if (fromDOM === toDOM) {
      fromDOM = container[FROM_DOM] = fromDOM.cloneNode(true)
    }
    // probably React removed the old view when it rendered the new one
    // otherwise the old view is cloned to do not collide with the new one (see setupAnimation)
    // reinsert the old view and run the leaveAnimation on it
    // after the animation is finished remove the old view again and finally
    container.insertBefore(fromDOM, toDOM)
    // DO NOT return the promise from animateElement()
    // there is no need to wait for the animation,
    // the views may be hidden by the animation, but the DOM routing is already over
    // it is safe to go on with routing the next level of routers
    return Promise.resolve()
      .then(() => runAnimation(fromDOM, leaveAnimation, context))
      .then(() => cleanup(container))
  }
}

function runAnimation(elem, animation, context) {
  const promise = animation(elem, context)
  if (!(promise instanceof Promise)) {
    throw new TypeError('Animations must return a promise')
  }
  return promise
}

function cleanup(container) {
  if (container[FROM_DOM] && container[FROM_DOM] !== container[TO_DOM]) {
    container[FROM_DOM].remove()
  }
  container[FROM_DOM] = container[TO_DOM] = undefined
}
