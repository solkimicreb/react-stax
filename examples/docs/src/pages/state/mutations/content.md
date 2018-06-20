# Mutating the Stores

State stores can be mutated from anywhere in arbitrary ways, but keeping state mutations in a central place is a good practice. In this section we will cover a few state management patterns.

## Mutating from store methods

Simple methods on the store are convenient places for mutating the state.

```js
import { store } from 'react-easy-stack';

const user = store({
  isLoggedIn: true,
  profile: {
    name: 'Developer Dan',
    age: 30
  },
  logout() {
    this.isLoggedIn = false;
    this.profile = {};
  }
});
export default user;
```

There is one big gotcha with this approach however. You can safely call `user.logout()` as a method, but as soon you pass it as a callback, it looses its `this` context. The below code would throw an error.

```jsx
export default () => <button onClick={user.logout}>Logout</button>;
```

A simple solution is to use the direct store reference instead of `this` inside store methods. The `logout()` method should be changed to set `user.isLoggedIn` instead of `this.isLoggedIn` and so on.

```js
const user = store({
  // ...
  logout() {
    user.isLoggedIn = false;
    user.profile = {};
  }
});
export default user;
```

## Keeping the store pure

Keeping the mutator functions separate from the store is another approach.

```js
import { store } from 'react-easy-stack';

const user = store({
  isLoggedIn: true,
  profile: {
    name: 'Developer Dan',
    age: 30
  }
});
export default user;

export function logout() {
  user.isLoggedIn = false;
  user.profile = {};
}
```

Exporting the data store as the default export and the mutator functions as named exports is an elegant pattern. You can import and use the store in the following ways.

```jsx
import user, { logout } from './userStore';
// OR ...
import userData, * as userActions from './userStore';
```

In big applications a single mutator method typically mutates more than one store. Moving the mutators in separate files after a certain complexity is a good idea.

## Global components

Some components - like notifications and loaders - are usually singleton inside applications. In these cases it makes sense to create a hidden store and expose a global mutator API for the component.

_Loader.jsx_

```jsx
import React from 'react';
import { store, view } from 'react-easy-stack';

const loader = store({
  isLoading: false
});

export const startLoading = () => (loader.isLoading = true);
export const stopLoading = () => (loader.isLoading = false);

export default view(
  () => (loader.isLoading ? <span>DUMMY LOADER</span> : null)
);
```

_App.jsx_

```jsx
import React from 'react';
import Loader, { startLoading, stopLoading } from './Loader';

export default () => (
  <div>
    <button onClick={startLoading}>Start loading</button>
    <button onClick={stopLoading}>Stop loading</button>
    <Loader />
  </div>
);
```

<div id="loader-demo"></div>

Mounting a single loader somewhere visible and calling the `startLoading`/`stopLoading` pair from a global http hook produces a single central loading logic and UI.
