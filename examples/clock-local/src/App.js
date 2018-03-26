import React, { Component } from 'react'
import moment from 'moment'
import { view, store } from 'react-easy-stack'

class App extends Component {
  clock = store({
    time: moment().format('hh:mm:ss A')
  });

  componentDidMount () {
    this.id = setInterval(
      () => (this.clock.time = moment().format('hh:mm:ss A')),
      1000
    )
  }

  componentWillUnmount () {
    clearInterval(this.id)
  }

  render () {
    return <div>{this.clock.time}</div>
  }
}

export default view(App)
