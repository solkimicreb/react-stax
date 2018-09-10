import React, { PureComponent, Children } from 'react'
import PropTypes from 'prop-types'
import { path, params, elements, animation } from './integrations'
import { addExtraProps } from './utils'
import { registerRouter, releaseRouter, route } from './core'

// a key for dummy pages when no matching page is found
const DUMMY_KEY = 'REACT_STAX_DUMMY'
// a key for leaving nodes, when the entering and leaving page is the same
const LEAVING_KEY = 'REACT_STAX_LEAVING'

// Router selects a single child to render based on its children's page props
// and the URL pathname token at the Router's depth (they can be nested)
export default class Router extends PureComponent {
  static propTypes = {
    defaultPage: PropTypes.string.isRequired,
    notFoundPage: PropTypes.string,
    onRoute: PropTypes.func,
    slave: PropTypes.bool,
    enterAnimation: PropTypes.func,
    leaveAnimation: PropTypes.func,
    // TODO: allowing none string elemnts messes with the animations (container ref is not a DOM Node)
    element: PropTypes.string
  }

  static defaultProps = {
    element: elements.div
  }

  static childContextTypes = { staxDepth: PropTypes.number }
  static contextTypes = { staxDepth: PropTypes.number }

  getChildContext() {
    return { staxDepth: this.depth + 1 }
  }

  // depth stores how nested is the router, root routers have a depth of 0
  get depth() {
    return this.context.staxDepth || 0
  }

  state = {}

  componentDidMount() {
    registerRouter(this, this.depth)
  }

  componentWillUnmount() {
    releaseRouter(this, this.depth)
  }

  // the raw DOM container node is needed for the animations
  saveContainer = container => (this.container = container)

  // this is part of the public API
  // it routes every router from the root depth
  route = options => route(options, this.depth)

  // routing is split in 2 phases
  // first all parallel routers at the same depth executes startRouting
  // then all parallel routers at the same depth execute finishRouting
  startRouting() {
    const { onRoute, defaultPage, slave } = this.props
    const fromPage = this.state.page
    const toPage = path[this.depth] || defaultPage
    // (parallel) slave routers do not update the URL pathname to avoid collisions
    if (!slave) {
      // fill the path with the default page, if the current path token is empty
      // this is important for relative links and automatic active link highlight
      path[this.depth] = toPage
    }

    // onRoute is where do user can intercept the routing or resolve data
    if (onRoute) {
      return onRoute({
        target: this,
        fromPage,
        toPage
      })
    }
  }

  // finishRouting is called when all parallel routers at the current depth
  // finished executing startRouting
  // resolvedData is the data returned from props.onRoute in startRouting
  finishRouting(resolvedData) {
    const { enterAnimation, leaveAnimation, defaultPage } = this.props
    const fromPage = this.state.page
    const toPage = path[this.depth] || defaultPage

    // do not update the view if the page did not change
    // and there is no new resolved data from onRoute
    // TODO: but animations should still kick in!
    if (fromPage === toPage && !resolvedData) {
      return
    }

    const nextState = {
      resolvedData,
      page: toPage,
      // reuse the current child (page) as the leaving page
      // if it is not a dummy page (used when no matching page is found)
      fromChild:
        leaveAnimation && this.toChild.key === DUMMY_KEY ? null : this.toChild
    }

    return new Promise(resolve => this.setState(nextState, resolve)).then(
      () => {
        const context = { fromPage, toPage }

        if (enterAnimation) {
          animation.enter(this.container, enterAnimation, context)
        }

        if (leaveAnimation) {
          animation
            .leave(this.container, leaveAnimation, context)
            // remove the leaving page after the leave animation is over
            .then(() => this.setState({ fromChild: null }))
        }
      }
    )
  }

  render() {
    const { element } = this.props
    const { page, resolvedData } = this.state
    let { fromChild } = this.state

    const children = []

    let toChild
    // if the resolvedData from onRoute is a React element use it as the view
    // this allows lazy loading components (and virtual routing)
    if (React.isValidElement(resolvedData)) {
      // validate the resolved child to have a page prop
      validateChild(resolvedData)
      toChild = resolvedData
    } else {
      // select the next child based on the children's page prop
      // and the string token in the URL pathname at the routers depth
      toChild = this.selectChild(page)
      if (toChild && resolvedData) {
        // of there is resolvedData from onRoute, inject it as props to the next view
        toChild = React.cloneElement(toChild, resolvedData)
      }
    }

    // if there is no matching page render an empty div
    toChild = toChild || React.createElement('div')
    toChild = React.cloneElement(toChild, { key: page || DUMMY_KEY })
    children.push(toChild)
    // save the current node (page) for later use
    // it has to fade out later during leave animations,
    // while the new page is already rendered
    this.toChild = toChild

    if (fromChild) {
      // if the same page is animated out and in, replace the leaving node's key
      // to avoid conflicts
      if (fromChild.key === toChild.key) {
        fromChild = React.cloneElement(fromChild, { key: LEAVING_KEY })
      }
      children.push(fromChild)
    }

    return React.createElement(
      element,
      // forward none Router specific props to the underlying DOM element
      addExtraProps({ ref: this.saveContainer }, this.props, Router.propTypes),
      // render the selected child or a dummy node
      // and a potential leaving child
      children
    )
  }

  // select the next view based on the children's page prop
  // and the string token in the URL pathname at the routers depth
  selectChild(page) {
    const children = Children.toArray(this.props.children)
    // validate if all children has a page prop
    children.forEach(validateChild)
    const selectedChild = children.find(child => child.props.page === page)
    // if the router is mounted and it has no matching child view,
    // try to render a notFoundPage
    // if the router is not yet mounted, the initial routing is not yet finished
    // in this case it should render nothing (null), instead of a notFoundPage
    if (!selectedChild && this.container) {
      const { notFoundPage } = this.props
      return children.find(child => child.props.page === notFoundPage)
    }
    return selectedChild
  }
}

// all Router children must have a page prop
function validateChild(child) {
  if (typeof child.props.page !== 'string') {
    throw new Error(
      'Every Router child must have a string valued, unique page prop'
    )
  }
}
