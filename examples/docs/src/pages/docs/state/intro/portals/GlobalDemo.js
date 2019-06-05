import React from 'react'

export default function render ({ view, store }) {
  const counter = store({ num: 0 })
  const increment = () => counter.num++

  const Counter = view(() => (
    <button onClick={increment}>Clicked {counter.num} times!</button>
  ))

  return () => (
    <div>
      <Counter />
      <Counter />
    </div>
  )
}
