// a fake backend for the doc examples, to let it work offline too
import Router from 'universal-router'

const NETWORK_DELAY = 300

const data = [
  { id: 1, name: 'Cool Beer' },
  { id: 2, name: 'Better Beer' },
  { id: 3, name: 'Best Beer' }
]

const routes = [
  {
    path: '(.*)',
    action() {
      return data
    }
  }
]

const router = new Router(routes)

export default function fetch(url) {
  const { pathname, search, hash } = new URL(url)
  const path = pathname + search + hash

  return new Promise(resolve => setTimeout(resolve, NETWORK_DELAY)).then(
    () => ({ json: () => router.resolve(path) })
  )
}
