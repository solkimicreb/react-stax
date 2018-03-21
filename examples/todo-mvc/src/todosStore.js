import { store, storage, params } from 'react-easy-stack'
import { defaults } from 'lodash'

defaults(params, { filter: 'all' })
defaults(storage, { todos: [] })

// a complex global store with a lot of derived data (getters and setters)
// use 'todos' instead of 'this' in the store methods to make them passable as callbacks
const todosStore = store({
  get active () {
    return storage.todos.filter(todo => !todo.completed)
  },
  get completed () {
    return storage.todos.filter(todo => todo.completed)
  },
  get todos () {
    switch (params.filter) {
      case 'completed': return todosStore.completed
      case 'active': return todosStore.active
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
    return todosStore.active.length
  },
  clearCompleted () {
    storage.todos = todosStore.active
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
    todosStore.allCompleted = !todosStore.allCompleted
  }
})

export default todosStore
