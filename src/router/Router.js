import React, { PureComponent, Children } from 'react'
import PropTypes from 'prop-types'
import { path, params, elements } from './integrations'
import { addExtraProps } from './utils'
import { registerRouter, releaseRouter, route } from './core'

// Router selects a single child to render based on its children's page props
// and the URL pathname token at the Router's depth (they can be nested)
export default class Router extends PureComponent {
  static propTypes = {
    defaultPage: PropTypes.string.isRequired,
    notFoundPage: PropTypes.string,
    onRoute: PropTypes.func,
    slave: PropTypes.bool,
    element: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
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

  state = {
    fromChild: null
  }

  componentDidMount() {
    registerRouter(this, this.depth)
  }

  componentWillUnmount() {
    releaseRouter(this, this.depth)
  }

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
  finishRouting(resolvedData, status) {
    const { defaultPage } = this.props
    const fromPage = this.state.page
    const toPage = path[this.depth] || defaultPage

    // do not update the view if the page did not change
    // and there is no new resolved data from onRoute
    if (fromPage === toPage && !resolvedData) {
      return
    }

    const nextState = {
      resolvedData,
      page: toPage
    }
    return new Promise(resolve => this.setState(nextState, resolve))
  }

  saveContainer = container => (this.container = container)

  render() {
    const { element } = this.props
    const { page, resolvedData } = this.state
    let { fromChild } = this.state

    let toChild = null
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

    return React.createElement(
      element,
      // forward none Router specific props to the underlying DOM element
      addExtraProps({}, this.props, Router.propTypes),
      toChild
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
