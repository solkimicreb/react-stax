import React from 'react'
import { render } from 'react-testing-library'
import sinon from 'sinon'
import { tz as timezone } from 'moment-timezone'
import { clock, App } from './App'

describe('Clock App with global store', () => {
  const timers = sinon.useFakeTimers()
  timezone.setDefault('UTC')
  clock.init()
  const { container: app } = render(<App />)

  afterAll(() => {
    timers.restore()
    timezone.setDefault()
  })

  test('should update to display the current time every second', () => {
    expect(app.textContent).toBe('12:00:00 AM')

    timers.tick(2000)
    expect(app.textContent).toBe('12:00:02 AM')

    timers.tick(8500)
    expect(app.textContent).toBe('12:00:10 AM')
  })
})
