# Routing Interception

The routing process can be intercepted for each `Router` by the `onRoute` property. `onRoute()` is a function with a single object parameter, which has the following properties:

- `fromPage`: the page name the router is routing away from.
- `toPage`: the page name the router is routing to.
- `fromParams`: the parameter pool of the previous page.

```jsx
import React from 'react';
import { Router, Link } from 'react-easy-stack';

function onRoute({ fromPage, toPage }) {
  alert(`Routing from ${fromPage} to ${toPage}`);
}

export default () => (
  <div>
    <Link to="profile">Profile Page</Link>
    <Link to="settings">Settings Page</Link>
    <Router defaultPage="profile" onRoute={onRoute}>
      <h3 page="profile">Profile Page</h3>
      <h3 page="settings">Settings Page</h3>
    </Router>
  </div>
);
```

<div id="interception-demo"></div>

The `onRoute` function is the only interception point for routing processes, but it is extremely versatile. It can be used to:

- <span id="redirect-link"></span> the routing.
- <span id="params-link"></span> for the next page.
- <span id="props-link"></span> into the next page.
- <span id="fetch-link"></span> for the next page.
- <span id="lazy-link"></span> for the next page.
- <span id="virtual-link"></span> for complex routing logic.

## Protected pages

Starting a new routing process cancels any ongoing routings. You can call `route()` inside the `onRoute()` function to intercept and redirect the current routing.

```jsx
import React from 'react';
import { Router, Link, route, store, view } from 'react-easy-stack';

const user = store({});

function toggleLogin() {
  user.isLoggedIn = !user.isLoggedIn;
  if (!user.isLoggedIn) {
    route({ to: 'public' });
  }
}

function onRoute({ fromPage, toPage }) {
  if (toPage === 'protected' && !user.isLoggedIn) {
    route({ to: fromPage });
  }
}

export default view(() => (
  <div>
    <Link to="public">Public Page</Link>
    <Link to="protected">Protected Page</Link>
    <button onClick={toggleLogin}>Log {user.isLoggedIn ? 'out' : 'in'}</button>
    <Router defaultPage="public" onRoute={onRoute}>
      <h3 page="public">Public Page</h3>
      <h3 page="protected">Protected Page</h3>
    </Router>
  </div>
));
```

<div id="protected-demo"></div>

The same pattern can be used to do pattern matching and redirects for applications with complex routing requirements.

## Default parameters

`onRoute` can be used to modify existing or set up default routing parameters for the next page. The `params` object is set to the new parameter pool at the very beginning of the routing process, so it always reflects the parameters of the next page inside `onRoute` functions.

```jsx
import React from 'react';
import { Router, Link, params } from 'react-easy-stack';

function onRoute({ toPage }) {
  if (toPage === 'list') {
    params.filter = params.filter || 'green';
  }
}

export default () => (
  <div>
    <Link to="list">Colors List</Link>
    <Link to="list" params={{ filter: 'red' }}>
      Red List
    </Link>
    <Link to="details">Details</Link>
    <Router defaultPage="list" onRoute={onRoute}>
      <h3 page="list">Colors List</h3>
      <h3 page="details">Color Details</h3>
    </Router>
  </div>
);
```

<div id="params-demo"></div>

You can use the `fromParams` property of `onRoute`'s argument to read parameters from the previous page.

## Props injection

`onRoute` may return an object, which will be injected into the next page component as props. The object is shallow merged with the existing props of the component.

```jsx
import React from 'react';
import { Router, Link, params } from 'react-easy-stack';

function onRoute({ toPage }) {
  if (toPage === 'list') {
    params.filter = params.filter || 'green';
    return { color: params.filter };
  }
}

const ColorsList = ({ color }) => <h3>{color} Colors</h3>;

export default () => (
  <div>
    <Link to="list">Colors List</Link>
    <Link to="list" params={{ filter: 'red' }}>
      Red List
    </Link>
    <Link to="details">Details</Link>
    <Router defaultPage="list" onRoute={onRoute}>
      <ColorsList page="list" />
      <h3 page="details">Color Details</h3>
    </Router>
  </div>
);
```

<div id="props-demo"></div>

You can use the `fromParams` property of `onRoute`'s argument to read parameters from the previous page.
