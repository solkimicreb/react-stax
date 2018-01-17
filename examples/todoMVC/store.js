import { store, params, storage } from 'react-easy-stack'

storage.todos = storage.todos || []

// a complex global store with a lot of derived data (getters and setters)
export default store({
  get todos () {
    switch (params.filter) {
      case 'completed': return storage.todos.filter(todo => todo.completed)
      case 'active': return storage.todos.filter(todo => !todo.completed)
      default: return storage.todos
    }
  },
  get isEmpty () {
    return storage.todos.length === 0
  },
  get hasCompleted () {
    return storage.todos.some(todo => todo.completed)
  },
  get allCompleted () {
    return storage.todos.every(todo => todo.completed)
  },
  set allCompleted (completed) {
    storage.todos.forEach(todo => (todo.completed = completed))
  },
  get activeCount () {
    return storage.todos.filter(todo => !todo.completed).length
  },
  create (title) {
    storage.todos.push({ title })
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
    storage.todos = storage.todos.filter(todo => !todo.completed)
  }
})
