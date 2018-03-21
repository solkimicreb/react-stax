import React from 'react'
import { render } from 'react-testing-library'
import sinon from 'sinon'
import { tz as timezone } from 'moment-timezone'
import App from './App'

describe('Clock App with local store', () => {
  const timers = sinon.useFakeTimers()
  timezone.setDefault('UTC')
  const clearIntervalSpy = sinon.spy(global, 'clearInterval')
  const { container: app, unmount } = render(<App />)

  afterAll(() => {
    timers.restore()
    timezone.setDefault()
    clearIntervalSpy.restore()
  })

  test('should update to display the current time every second', () => {
    expect(app.textContent).toBe('12:00:00 AM')

    timers.tick(2000)
    expect(app.textContent).toBe('12:00:02 AM')

    timers.tick(8500)
    expect(app.textContent).toBe('12:00:10 AM')
  })

  test('should clean up the interval timer when the component is unmounted', () => {
    unmount()
    expect(clearIntervalSpy.callCount).toBe(1)
  })
})
