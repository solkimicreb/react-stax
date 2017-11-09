import { easyStore, params, storage } from 'react-easy-stack'

storage.todos = storage.todos || []
params.filter = params.filter || 'all'

// a complex global store with a lot of derived data (getters and setters)
const store = easyStore({
  get all () {
    return storage.todos
  },
  get active () {
    return this.all.filter(todo => !todo.completed)
  },
  get completed () {
    return this.all.filter(todo => todo.completed)
  },
  get hasCompleted () {
    return this.completed.length !== 0
  },
  get allCompleted () {
    return this.all.every(todo => todo.completed)
  },
  set allCompleted (completed) {
    this.all.forEach(todo => {
      todo.completed = completed
    })
  },
  get isEmpty () {
    return this.all.length === 0
  },
  create (title) {
    this.all.push({ title })
  },
  remove (id) {
    this.all.splice(id, 1)
  },
  toggle (id) {
    const todo = this.all[id]
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
export default easyStore(store)
