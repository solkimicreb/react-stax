import React, { Component } from 'react'
import { view, Link } from 'react-easy-stack'
import TodoItem from './TodoItem'
import todosStore from './todosStore'

// render is triggered whenever the relevant parts of the global todos store change
class App extends Component {
  // create a todo on Enter key press
  createTodo = ev => {
    if (ev.keyCode === 13 && ev.target.value) {
      todosStore.create(ev.target.value)
      ev.target.value = ''
    }
  };

  render () {
    const {
      todos,
      isEmpty,
      hasCompleted,
      allCompleted,
      activeCount,
      toggleAll,
      clearCompleted
    } = todosStore

    return (
      <div className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input
            onKeyUp={this.createTodo}
            className='new-todo'
            placeholder='What needs to be done?'
            autoFocus
          />
        </header>

        {!isEmpty && (
          <section className='main'>
            <input
              className='toggle-all'
              type='checkbox'
              checked={allCompleted}
              onChange={toggleAll}
            />
            <label htmlFor='toggle-all'>Mark all as complete</label>
            <ul className='todo-list'>
              {todos.map((todo, idx) => (
                <TodoItem {...todo} id={idx} key={idx} />
              ))}
            </ul>
          </section>
        )}

        {!isEmpty && (
          <footer className='footer'>
            <span className='todo-count'>{activeCount} items left</span>
            <div className='filters'>
              <Link params={{ filter: 'all' }} activeClass='selected'>
                All
              </Link>
              <Link params={{ filter: 'active' }} activeClass='selected'>
                Active
              </Link>
              <Link params={{ filter: 'completed' }} activeClass='selected'>
                Completed
              </Link>
            </div>
            {hasCompleted && (
              <button className='clear-completed' onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
    )
  }
}

export default view(App)
