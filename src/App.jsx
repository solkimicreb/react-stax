import React, { Component } from 'react'
import Router from './Router'
import Dummy from './Dummy'
import Link from './Link'

export default class App extends Component {
  async onRoute () {
    await new Promise(resolve => setTimeout(resolve, 1))
  }

  render () {
    return (
      <div>
        <Link to='/hello' element='li'>
          Link to Hello
        </Link>
        <Link to='/hi' element='li' params={{ name: 'Berci' }}>
          Link to Hi
        </Link>

        <Router>
          <Dummy page='hello' />
          <Router page='hi' default onRoute={this.onRoute}>
            <Dummy page='world' default />
            <Dummy page='you' />
          </Router>
        </Router>

        <Router>
          <Dummy page='hello' />
          <Dummy page='hi' default />
        </Router>
      </div>
    )
  }
}
