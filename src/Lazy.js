import React, { Component, PropTypes } from 'react'

export default class Lazy extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired
  }

  constructor ({ load } = props) {
    super(props)
    load().then(comp => this.setComp(comp))
  }

  setComp (comp) {
    this.comp = comp
    this.forceUpdate()
  }

  render () {
    return this.comp || null // maybe return children otherwise
  }
}
