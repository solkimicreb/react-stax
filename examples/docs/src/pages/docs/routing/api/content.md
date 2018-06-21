Dynamic parameters can be added with the `params` property of `Link` or the `route` function.

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

Parameters must be primitives, which are added to the query string and exposed on the `params` object. The type of each parameter is encoded in the query string and restored on page loads from links.

## The params object

The `params` object stores the current parameters and it is two-way synchronized with query string. The Link's `params` property should be used to set the starting parameter pool for the page and the `params` object can be used to manipulate the parameters while the page is active.

```jsx
import React from 'react';
import { Router, Link } from 'react-easy-stack';

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

You can learn more about the params object in the <span id="integrations-link"></span>.
