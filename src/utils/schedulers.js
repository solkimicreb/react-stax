import { Queue, priorities } from '@nx-js/queue-util'

// run state change reactions synchronously
export const sync = new Queue(priorities.SYNC)

// run integration reactions with a low priority
// URL and storage updates are not something the user is eagerly waiting for
export const low = new Queue(priorities.LOW)

export function start () {
  low.start()
  sync.start()
}

export function process () {
  low.process()
  sync.process()
}

export function stop () {
  low.stop()
  sync.stop()
}
