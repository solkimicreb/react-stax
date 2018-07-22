Routing parameters can be added via the `params` property of the `Link` component or the `route()` function. The parameters must be primitives and they are always saved in the query string.

```jsx
import React from 'react';
import { Router, Link, params } from 'react-easy-stack';

const users = { '1': 'Ann', '12': 'Bob' };

const UsersPage = () => (
  <div>
    <h3>User List</h3>
    {Object.keys(users).map(id => (
      <div key={id}>
        <Link to="/details" params={{ id }}>
          {users[id]}
        </Link>
      </div>
    ))}
  </div>
);
const DetailsPage = () => <p>User: {users[params.id]}</p>;

export default () => (
  <Router defaultPage="users">
    <UsersPage page="users" />
    <DetailsPage page="details" />
  </Router>
);
```

<div id="starting-params-demo"></div>

## The params object

The `Link`'s `params` property sets the starting parameter pool for the page on navigation and the top-level `params` object can be used to manipulate the parameters while the page is active. It reflects the current parameter pool and it is two-way synchronized with query string.

```jsx
import React from 'react';
import { Router, Link, params } from 'react-easy-stack';

const users = [{ id: 1, name: 'Ann' }, { id: 2, name: 'Bob' }];

const UsersPage = () => (
  <div>
    <h3>User List</h3>
    {users.map(user => (
      <div key={user.id}>
        <Link to="/details" params={{ id: user.id }}>
          {user.name}
        </Link>
      </div>
    ))}
  </div>
);
const DetailsPage = () => (
  <p>User: {JSON.stringify(users.find(user => user.id === params.id))}</p>
);

export default () => (
  <Router defaultPage="users">
    <UsersPage page="users" />
    <DetailsPage page="details" />
  </Router>
);
```

<div id="params-demo"></div>

> The parameters' type information is saved in the query string and types are respected during the two-way synchronization process.

You can learn more about the params object in the <span id="integrations-link"></span>.

## The `inherit` option

Links and the `route` function have an `inherit` boolean option, which toggles if the routing should inherit or overwrite to existing parameters. It defaults to `false`.

```jsx
<Link to="path" params={{ param: 'value' }} inherit={true} />;
// OR ...
route({ to: 'path', params: { param: 'value' }, inherit: true });
```
