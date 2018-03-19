import { Queue, priorities } from '@nx-js/queue-util'

export const scheduler = new Queue(priorities.LOW)
export const localStorage = window.localStorage
export const history = window.history
export const location = window.location
export const historyHandler = handler => window.addEventListener('popstate', handler)
export const normalizeProps = props => props
export const anchor = 'a'
export const div = 'div'