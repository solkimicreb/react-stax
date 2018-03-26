import React from 'react'
import { render, Simulate } from 'react-testing-library'
import sinon from 'sinon'
import { tz as timezone } from 'moment-timezone'
import App from './App'
import clock, { reset } from './clock'

describe('Stopwatch App', () => {
  const timers = sinon.useFakeTimers()
  timezone.setDefault('UTC')
  const { app: container, queryByTestId } = render(<App />)
  const toggle = queryByTestId('toggle')
  const reset = queryByTestId('reset')
  const display = queryByTestId('display')

  afterEach(() => {
    reset()
  })

  afterAll(() => {
    timers.restore()
    timezone.setDefault()
  })

  test('should be idle when needed', () => {
    expect(display.textContent).toBe('00:0000')

    timers.tick(2000)
    expect(display.textContent).toBe('00:0000')
  })

  test('should start and stop', () => {
    Simulate.click(toggle)

    timers.tick(2000)
    expect(display.textContent).toBe('00:0200')

    Simulate.click(toggle)
    timers.tick(4000)
    expect(display.textContent).toBe('00:0200')
  })

  test('should reset', () => {
    Simulate.click(toggle)
    timers.tick(3000)
    expect(display.textContent).toBe('00:0300')

    Simulate.click(reset)
    expect(display.textContent).toBe('00:0000')
  })
})
