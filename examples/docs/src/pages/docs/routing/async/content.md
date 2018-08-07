`onRoute()` may return a Promise or be an async function, in which case the routing process will wait until it resolves.

## Async data resolution

You can fetch the necessary data for the next page inside `onRoute` and save it into your stores or inject them as props. The routing process will wait for all data to be fetched before it switches the router to the next page.

```jsx
import React from 'react';
import { view, store, params, Router, Link } from 'react-stax';

const beers = store({
  list: [],
  get selected() {
    return beers.list.find(beer => beer.id === params.id);
  }
});

const fetchBeers = () =>
  fetch(`https://api.punkapi.com/v2/beers`)
    .then(res => res.json())
    .then(list => (beers.list = list || []));

const List = view(() => (
  <div>
    {beers.list.map(beer => (
      <Link to="/details" params={{ id: beer.id }} key={beer.id}>
        {beer.name}
      </Link>
    ))}
  </div>
));

const Details = view(() => (
  <div>
    <h4>{beers.selected.name}</h4>
    <p>{beers.selected.description}</p>
  </div>
));

async function onRoute({ toPage }) {
  if (toPage === 'list') {
    await fetchBeers();
  }
}

export default () => (
  <Router defaultPage="list" onRoute={onRoute}>
    <List page="list" />
    <Details page="details" />
  </Router>
);
```

<div id="starting-params-demo"></div>

Mutating stores during a routing does not have an immediate effect. All view updates are batched and committed at once at the end of the routing.

## Lazy loading

`onRoute` may return a React element, in which case the element will be rendered as the next page of the router.

```jsx
import React from 'react';
import { Router, Link } from 'react-stax';

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

> All `Router` children must have a `page` props, including the ones returned from `onRoute`.

## Virtual routing

You can completely replace the component based declarative routing with the `onRoute` function for complex use cases.
