import { easyStore, params, storage } from 'react-easy-stack'

storage.todos = storage.todos || []
params.filter = params.filter || 'all'

// a complex global store with a lot of derived data (getters and setters)
const store = easyStore({
  get isEmpty () {
    return storage.todos.length === 0
  },
  get completed () {
    return storage.todos.filter(todo => todo.completed)
  },
  get hasCompleted () {
    return this.completed.length !== 0
  },
  get allCompleted () {
    return storage.todos.every(todo => todo.completed)
  },
  set allCompleted (completed) {
    storage.todos.forEach(todo => {
      todo.completed = completed
    })
  },
  get active () {
    return storage.todos.filter(todo => !todo.completed)
  },
  create (title) {
    storage.todos.push({ title })
  },
  changeFilter (filter) {
    params.filter = filter
  },
  remove (id) {
    storage.todos.splice(id, 1)
  },
  toggle (id) {
    const todo = storage.todos[id]
    todo.completed = !todo.completed
  },
  toggleAll () {
    this.allCompleted = !this.allCompleted
  },
  clearCompleted () {
    storage.todos = this.active
  }
})

// store.filter is two-way synchronized with the URL query string
// and adds a new history item whenever it changes
// store.all is synchronized with the LocalStorage,
// so the todos are kept between page reloads
export default easyStore(store, {
  filter: 'url',
  all: 'storage'
})
