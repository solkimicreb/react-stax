export const main = [
  {
    name: 'home',
    link: 'Home',
    path: '/home',
    edit: 'https://google.com',
    sidebar: false
  },
  {
    name: 'docs',
    path: '/docs',
    virtual: true
  },
  {
    name: 'examples',
    path: '/examples',
    virtual: true
  },
  {
    name: 'faq',
    path: '/faq',
    virtual: true
  }
]

export const docs = [
  { name: 'state', path: '/docs/state', virtual: true },
  { name: 'routing', path: '/docs/routing', virtual: true }
]

export const state = [
  {
    name: 'intro',
    title: 'State Management',
    link: 'Introduction',
    edit: 'github url',
    path: '/docs/state/intro'
  },
  {
    name: 'mutations',
    title: 'Mutating the Stores',
    edit: 'github url',
    path: '/docs/state/mutations'
  },
  {
    name: 'computed',
    title: 'Computed Data',
    edit: 'github url',
    path: '/docs/state/computed'
  },
  {
    name: 'batching',
    title: 'Batching Updates',
    edit: 'github url',
    path: '/docs/state/batching'
  },
  {
    name: 'api',
    title: 'API Summary',
    edit: 'github url',
    path: '/docs/state/api'
  }
]

export const routing = [
  {
    name: 'intro',
    title: 'Routing',
    link: 'Introduction',
    edit: 'github url',
    path: '/docs/routing/intro'
  },
  {
    name: 'nested',
    title: 'Nested Routing',
    edit: 'github url',
    path: '/docs/routing/nested'
  },
  {
    name: 'params',
    title: 'Routing Parameters',
    link: 'Dynamic Parameters',
    edit: 'github url',
    path: '/docs/routing/params'
  },
  {
    name: 'intercept',
    title: 'Routing Interception',
    link: 'Interception',
    edit: 'github url',
    path: '/docs/routing/intercept'
  },
  {
    name: 'async',
    title: 'Async Interception',
    edit: 'github url',
    path: '/docs/routing/async'
  },
  {
    name: 'scroll',
    title: 'Scroll Handling',
    edit: 'github url',
    path: '/docs/routing/scroll'
  },
  {
    name: 'link',
    title: 'Link Activity',
    edit: 'github url',
    path: '/docs/routing/link'
  },
  {
    name: 'parallel',
    title: 'Parallel Routing',
    edit: 'github url',
    path: '/docs/routing/parallel'
  },
  {
    name: 'animations',
    title: 'Animations',
    edit: 'github url',
    path: '/docs/routing/animations'
  },
  {
    name: 'advanced',
    title: 'Advanced Animations',
    edit: 'github url',
    path: '/docs/routing/advanced'
  },
  {
    name: 'api',
    title: 'API Summary',
    edit: 'github url',
    path: '/docs/routing/api'
  }
]

export const examples = [
  {
    name: 'todomvc',
    title: 'Todo MVC',
    edit: '',
    path: '/examples/todomvc'
  }
]

export const faq = [
  {
    name: 'platforms',
    title: 'Platform Support',
    edit: 'github url',
    path: '/faq/platforms'
  },
  {
    name: 'performance',
    title: 'Performance',
    edit: 'github url',
    path: '/faq/performance'
  }
]

export const all = [
  main[0],
  docs[0],
  ...state,
  docs[1],
  ...routing,
  main[1],
  ...examples,
  main[2],
  ...faq
]
