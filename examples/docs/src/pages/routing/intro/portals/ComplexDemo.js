import React, { Component } from 'react';

export default function render({ view, store }) {
  const user = store({
    name: 'Dev Dan'
  });
  const repos = store([]);

  class Counter extends Component {
    store = store({ num: 0 });
    increment = () => this.store.num++;

    render() {
      return (
        <button onClick={this.increment}>
          Clicked {this.store.num} times!
        </button>
      );
    }
  }
  Counter = view(Counter);

  return () => (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}
