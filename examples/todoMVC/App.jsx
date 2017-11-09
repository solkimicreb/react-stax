import React, { Component } from 'react'
import { easyComp, Link, params } from 'react-easy-stack'
import TodoItem from './TodoItem'
import todos from './store'

// render is triggered whenever the relevant parts of the global todos store change
class App extends Component {
  // create a todo on Enter key press
  createTodo (ev) {
    if (ev.keyCode === 13 && ev.target.value) {
      todos.create(ev.target.value)
      ev.target.value = ''
    }
  }

  render () {
    const { isEmpty, hasCompleted, allCompleted, active, toggleAll, clearCompleted } = todos
    const { filter } = params

    return (
      <div className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input onKeyUp={this.createTodo} className='new-todo' placeholder='What needs to be done?' autoFocus />
        </header>

        {!isEmpty && <section className='main'>
          <input className='toggle-all' type='checkbox' checked={allCompleted} onChange={toggleAll} />
          <label htmlFor='toggle-all'>Mark all as complete</label>
          <ul className='todo-list'>
            {todos[filter].map((todo, idx) => <TodoItem {...todo} id={idx} key={idx} />)}
          </ul>
        </section>}

        {!isEmpty && <footer className='footer'>
          <span className='todo-count'>{active.length} items left</span>
          <div className='filters'>
            <Link element='button' activeClass='selected' params={{filter: 'all'}}>All</Link>
            <Link element='button' activeClass='selected' params={{filter: 'active'}}>Active</Link>
            <Link element='button' activeClass='selected' params={{filter: 'completed'}}>Completed</Link>
          </div>
          {hasCompleted && <button className='clear-completed' onClick={clearCompleted}>
            Clear completed
          </button>}
        </footer>}
      </div>
    )
  }
}

// wrap the component with easyComp before exporting it
export default easyComp(App)
