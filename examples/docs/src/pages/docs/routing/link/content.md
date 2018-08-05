State management is based on transparent reactivity, which means you don't have to explicitly control which component should render when. You can simply use the necessary parts of your state in your components and let easy-stack re-render them for you.

## Creating state stores

State can be stored in any object, but state stores must be wrapped with `store()` before they are used. `store()` wraps the passed object with a transparent reactive Proxy, which is invisible from the outside. The wrapped object behaves exactly like the original one.

```js
import { store } from 'react-easy-stack';

// wrap the object with `store` before you use it
const user = store({
  name: 'Developer Dan',
  age: 30
});

// stores behave exactly like the underlying object
user.name = 'Dev Dan';
user.email = 'dan@dev.com';
delete user.age;
```

## Creating reactive views

Any React component can be made reactive, by wrapping it with `view()`. Reactive components re-render when the state - which is used during their render - changes.

```jsx
import React from 'react';
import { store, view } from 'react-easy-stack';

const counter = store({ num: 0 });
setInterval(() => counter.num++, 1000);

export default view(() => <p>The num is {counter.num}.</p>);
```

<div id="basic-demo"></div>

> Always wrap your reactive components with `view` before you export them or mount them in other components. This rule applies to both function and class components.

## Handling global state

Global state can be shared by using the same store in multiple components.

```jsx
import React from 'react';
import { store, view } from 'react-easy-stack';

const counter = store({ num: 0 });
const increment = () => counter.num++;

export default view(() => (
  <button onClick={increment}>Clicked {counter.num} times!</button>
));
```

<div id="global-demo"></div>

The two counter instances share the same `counter.num` number and increment together, when the number changes.

## Handling local state

You can create stores as component properties to handle local state. These stores work like the global ones, but they are encapsulated in the component instance.

```jsx
import React, { Component } from 'react';
import { store, view } from 'react-easy-stack';

class Counter extends Component {
  store = store({ num: 0 });
  increment = () => this.store.num++;

  render() {
    return (
      <button onClick={this.increment}>Clicked {this.store.num} times!</button>
    );
  }
}
export default view(Counter);
```

<div id="local-demo"></div>

The two buttons increment separately, since they both use their own encapsulated state store.

> You can use plain React `state` and `setState()` instead of local stores if you prefer to. Do not call your local store `state` however. Stores are directly mutated, while React `state` is expected to be immutable.

## Building complex apps

A component may use any combination of local and global state stores. In a typical React app you will likely have a handful of global stores: one for the user and one each page for example.

_userStore.js_

```js
import { store } from 'react-easy-stack';

export default store({
  name: 'Dev Dan'
});
```

_reposStore.js_

```js
import { store } from 'react-easy-stack';

export default store({
  list: [],
  selected: null
});
```

_ReposPage.jsx_

```jsx
import React from 'react';
import { view } from 'react-easy-stack';
import user from './userStore';
import repos from './reposStore';

export default view(() => (
  <div>
    <p>{user.name}'s repos:</p>
    <ul>{repos.list.map(repo => <li key={repo.id}>{repo.name}</li>)}</ul>
  </div>
));
```
