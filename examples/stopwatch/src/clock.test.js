import sinon from 'sinon'
import { tz as timezone } from 'moment-timezone'
import clock from './clock'

describe('Stopwatch store', () => {
  const timers = sinon.useFakeTimers()
  timezone.setDefault('UTC')

  afterEach(() => {
    clock.reset()
  })

  afterAll(() => {
    timers.restore()
    timezone.setDefault()
  })

  test('should be idle when needed', () => {
    expect(clock.ticks).toBe(0)

    timers.tick(2000)
    expect(clock.ticks).toBe(0)
  })

  test('should start and stop', () => {
    clock.toggle()

    timers.tick(2000)
    expect(clock.ticks).toBe(200)

    clock.toggle()
    timers.tick(4000)
    expect(clock.ticks).toBe(200)
  })

  test('should reset', () => {
    clock.start()
    timers.tick(3000)
    expect(clock.ticks).toBe(300)

    clock.reset()
    expect(clock.ticks).toBe(0)
  })

  test('should format the time', () => {
    clock.start()
    timers.tick(132020)
    expect(clock.time).toEqual({
      seconds: '02:12',
      fraction: '02'
    })
  })
})
