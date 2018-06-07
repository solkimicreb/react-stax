import { animation } from "../../integrations";

const FROM_DOM = Symbol("from DOM");

Object.assign(animation, {
  setup(container) {
    cleanup(container);
    const fromDOM = container.firstElementChild;
    // cloning is necessary to allow cross fade effects for transitions
    // between the same page (when only the params change)
    // not cloning here would let react reuse the old view
    // and the new and old view would link to the same piece of raw DOM,
    // which obviously messes up the animation
    if (fromDOM) {
      container[FROM_DOM] = fromDOM.cloneNode(true);
    }
  },
  enter(container, enterAnimation) {
    const toDOM = container.firstElementChild;
    // only do an enter animation if this is not the initial routing of the router
    // this prevents cascading over-animation, in case of nested routers
    // only the outmost one will animate, the rest will appear normally
    if (enterAnimation && toDOM) {
      animateElement(toDOM, enterAnimation);
    }
  },
  leave(container, leaveAnimation) {
    const fromDOM = container[FROM_DOM];
    const toDOM = container.firstElementChild;

    if (leaveAnimation && fromDOM) {
      // probably React removed the old view when it rendered the new one
      // otherwise the old view is cloned to do not collide with the new one (see setupAnimation)
      // reinsert the old view and run the leaveAnimation on it
      // after the animation is finished remove the old view again and finally
      container.insertBefore(fromDOM, toDOM);
      // DO NOT return the promise from animateElement()
      // there is no need to wait for the animation,
      // the views may be hidden by the animation, but the DOM routing is already over
      // it is safe to go on with routing the next level of routers
      animateElement(fromDOM, leaveAnimation).then(() => cleanup(container));
    }
  }
});

function cleanup(container) {
  if (container[FROM_DOM]) {
    container[FROM_DOM].remove();
    container[FROM_DOM] = undefined;
  }
}

function animateElement(element, options) {
  // use the native webanimations API when available
  // it is the user's responsibility to polyfill it otherwise
  if (typeof element.animate === "function") {
    if (typeof options === "function") {
      options = options();
    }
    const animation = element.animate(options.keyframes, options);
    return new Promise(resolve => (animation.onfinish = resolve));
  } else {
    console.warn("You should polyfill the webanimation API.");
    return Promise.resolve();
  }
}
