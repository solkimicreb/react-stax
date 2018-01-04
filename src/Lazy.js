import React, { Component, PropTypes } from 'react'

export default class Lazy extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired
  }

  state = {}

  componentDidMount () {
    this.props.load()
      .then(comp => this.setState({ comp }))
  }

  render () {
    return this.state.comp || null
  }
}
