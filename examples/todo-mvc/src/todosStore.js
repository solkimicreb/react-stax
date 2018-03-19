import { store, storage, params } from 'react-easy-stack'
import * as stack from 'react-easy-stack'

params.filter = params.filter || 'all'
storage.todos = storage.todos || []

// a complex global store with a lot of derived data (getters and setters)
// use 'todos' instead of 'this' in the store methods to make them passable as callbacks
const todos = store({
  get todos () {
    switch (params.filter) {
      case 'completed':
        return storage.todos.filter(todo => todo.completed)
      case 'active':
        return storage.todos.filter(todo => !todo.completed)
      default:
        return storage.todos
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
    todos.allCompleted = !todos.allCompleted
  },
  clearCompleted () {
    storage.todos = storage.todos.filter(todo => !todo.completed)
  }
})

export default todos
