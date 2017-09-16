import React, { Component, PropTypes } from 'react'
import Link from './Link'

export default class Dummy extends Component {
  render () {
    return (
      <div>
        <h2>{this.props.page}!</h2>
        <Link to='world'>Link to world</Link>
        <Link to='you'>Link to you</Link>
        <Link to='/hello'>Link to Hello</Link>
        <Link to='/hi'>Link to Hi</Link>
      </div>
    )
  }
}
