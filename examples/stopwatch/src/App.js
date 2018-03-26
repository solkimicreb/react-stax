import React, { Fragment } from 'react'
import { view } from 'react-easy-stack'
import clock, { toggle, reset } from './clock'

function StopWatch () {
  const { time, isTicking } = clock
  const label = isTicking ? 'Stop' : 'Start'

  return (
    <Fragment>
      <div data-testid='display'>
        {time.seconds}
        <small>{time.fraction}</small>
      </div>
      <button onClick={toggle} data-testid='toggle'>{label}</button>
      <button onClick={reset} data-testid='reset'>Reset</button>
    </Fragment>
  )
}

export default view(StopWatch)
