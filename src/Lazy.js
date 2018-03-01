import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Lazy extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired
  };

  state = {};

  componentDidMount () {
    this.props.load().then(comp => this.setState({ comp }))
  }

  render () {
    return this.state.comp || null
  }
}
