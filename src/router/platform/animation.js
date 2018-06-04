export class Animation {
  constructor(container) {
    this.container = container;
  }

  setup() {
    const fromDOM = this.container.firstElementChild;
    // cloning is necessary to allow cross fade effects for transitions
    // between the same page (when only the params change)
    // not cloning here would let react reuse the old view
    // and the new and old view would link to the same piece of raw DOM,
    // which obviously messes up the animation
    if (fromDOM) {
      this.fromDOM = fromDOM.cloneNode(true);
    }
  }

  enter(enterAnimation) {
    const toDOM = this.container.firstElementChild;
    // only do an enter animation if this is not the initial routing of the router
    // this prevents cascading over-animation, in case of nested routers
    // only the outmost one will animate, the rest will appear normally
    if (enterAnimation && toDOM) {
      animateElement(toDOM, enterAnimation);
    }
  }

  leave(leaveAnimation) {
    const fromDOM = this.fromDOM;
    const toDOM = this.container.firstElementChild;

    if (leaveAnimation && fromDOM) {
      // probably React removed the old view when it rendered the new one
      // otherwise the old view is cloned to do not collide with the new one (see setupAnimation)
      // reinsert the old view and run the leaveAnimation on it
      // after the animation is finished remove the old view again and finally
      this.container.insertBefore(fromDOM, toDOM);
      // DO NOT return the promise from animateElement()
      // there is no need to wait for the animation,
      // the views may be hidden by the animation, but the DOM routing is already over
      // it is safe to go on with routing the next level of routers
      animateElement(fromDOM, leaveAnimation).then(() => this.cleanup());
    }
  }

  cleanup() {
    if (this.fromDOM) {
      this.fromDOM.remove();
      this.fromDOM = undefined;
    }
  }
}

function animateElement(element, options) {
  // use the native webanimations API when available
  // it is the user's responsibility to polyfill it otherwise
  if (typeof element.animate === 'function') {
    if (typeof options === 'function') {
      options = options();
    }
    const animation = element.animate(options.keyframes, options);
    return new Promise(resolve => (animation.onfinish = resolve));
  } else {
    console.warn('You should polyfill the webanimation API.');
    return Promise.resolve();
  }
}
