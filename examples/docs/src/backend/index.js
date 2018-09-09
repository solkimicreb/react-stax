// a fake backend for the doc examples, to let it work offline too

const NETWORK_DELAY = 300

const data = [
  { id: 1, name: 'Cool Beer' },
  { id: 2, name: 'Better Beer' },
  { id: 3, name: 'Best Beer' }
]

export default function fetch(url) {
  return new Promise(resolve => setTimeout(resolve, NETWORK_DELAY)).then(
    () => ({ json: () => data })
  )
}
