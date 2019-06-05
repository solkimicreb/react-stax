import React, { Component } from 'react'
import classNames from 'classnames'
import { view } from 'react-easy-stack'
import todos from './todosStore'

class TodoItem extends Component {
  remove = () => todos.remove(this.props.id);
  toggle = () => todos.toggle(this.props.id);

  render () {
    const { toggle, remove } = this
    const { title, completed = false } = this.props

    const itemClass = classNames('view', { completed })

    return (
      <li className={itemClass}>
        <input
          className='toggle'
          type='checkbox'
          checked={completed}
          onChange={toggle}
        />
        <label>{title}</label>
        <button onClick={remove} className='destroy' />
      </li>
    )
  }
}

export default view(TodoItem)
