> A complete routing and state management solution for practical developers.

A React stack, which puts rapid development and product quality before theoretical code beauty. Easy Stack apps should effortlessly meet subtle user expectations - like browser history and URL integration, animated page transitions and routing without a cascade of loaders.

## Installation

`npm install react-easy-stack`

### From zero to a running app

Easy Stack supports [create-react-app](https://github.com/facebookincubator/create-react-app) without additional configuration. Replace `APP_NAME` with your preferred app name and run the following commands to get started.

```bash
npx create-react-app APP_NAME
cd APP_NAME
npm install react-easy-stack
npm start
```

> You need npm 5.2+ to use the [npx](https://www.npmjs.com/package/npx) command.

## Routing

Routing is inspired by file systems and the old school web. In its simplest form it looks like this:

```jsx
import React from 'react';
import { Router, Link } from 'react-easy-stack';

export default () => (
  <div>
    <Link to="list">List Link</Link>
    <Link to="details">Details Link</Link>
    <Router defaultPage="list">
      <div page="list">List Page</div>
      <div page="details">Details Page</div>
    </Router>
  </div>
);
```

<div id="routing-demo"></div>

The routing API has three components:

- `Router` is like a folder, think of its child components as files and child routers as subfolders.
- `Link` navigates in the Router tree.
- `route` is a function for programmatic navigation.

These three provide features like nested and parallel routing, relative and absolute routes, async data resolution, lazy loading, active link styling, scroll management and animated page transitions.

You can take a deeper dive in the <span id="routing-link"></span>.

## State Management

State management focuses on freedom and flexibility. It automatically updates the view on state changes without any restrictions on state structure, placement or manipulation.

```jsx
import React from 'react';
import { view, store } from 'react-easy-stack';

const beers = store([]);

const getRandomBeer = () =>
  fetch('https://api.punkapi.com/v2/beers/random')
    .then(res => res.json())
    .then(json => beers.push(json[0]));

export default view(() => (
  <div>
    <button onClick={getRandomBeer}>Get a random beer</button>
    <ul>{beers.map(beer => <li key={beer.id}>{beer.name}</li>)}</ul>
  </div>
));
```

<div id="state-demo"></div>

The state management API has two functions:

- `store` creates reactive stores for your data.
- `view` creates reactive views, which re-render when the data mutates.

You can put anything in your stores and mutate them in arbitrary way, the necessary components will always re-render to reflect the new state. You could store a mix of deeply nested objects with arrays and maps. You could add or delete properties dynamically or even use computed getters or inheritance.

The possibilities are endless, learn more about common patterns in the <span id="state-link"></span>.

## Browser integration

Good web pages use the platform, they are shareable by URL and integrate with the browser history. Easy Stack has a few plain objects, which automatically two-way synchronize with the URL and localStorage to offload some integration complexity from you.

```jsx
import React from 'react';
import { view, params } from 'react-easy-stack';

const setFilter = ev => (params.value = ev.target.value);
export default view(() => <input value={params.filter} onChange={setFilter} />);
```

<div id="integrations-demo"></div>

The integrations API has three objects:

- `params` is an object, which is always in sync with the URL query parameters. Forget the times when you had to reload a page to change a single query parameter.
- `path` is an array which is in sync with the current URL pathname.
- `storage` is an object, which is in sync with the localStorage. It is perfect for offline caching or storing session data.

You can learn more about common use cases in the <span id="integrations-link"></span>.

## Making an app

The above examples fit together to create a simple beer fetching app. Just type in your favorite food and find out which beers pairs well with it.

```jsx
import React from 'react';
import { view, store, params, Router, Link } from 'react-easy-stack';

const beers = store({
  list: [],
  selected: {}
});

const fetchBeers = () =>
  fetch(`https://api.punkapi.com/v2/beers?food=${params.filter}`)
    .then(res => res.json())
    .then(list => (beers.list = list || []));

const fetchBeer = () =>
  fetch(`https://api.punkapi.com/v2/beers/${params.id}`)
    .then(res => res.json())
    .then(list => (beers.selected = list[0] || {}));

const updateFilter = ev => (params.filter = ev.target.value);

async function onRoute({ toPage }) {
  if (toPage === 'list') {
    params.filter = params.filter || 'apple';
    await fetchBeers();
  } else if (toPage === 'details') {
    await fetchBeer();
  }
}

const List = view(() => (
  <div>
    <input value={params.filter} onChange={updateFilter} />
    <button onClick={fetchBeers}>Search beers</button>
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

return () => (
  <Router defaultPage="list" onRoute={onRoute}>
    <List page="list" />
    <Details page="details" />
  </Router>
);
```

<div id="final-demo"></div>

> Press all the buttons in the demo app. Try out how it behaves on history events, page reload or manual url manipulation.

You can continue with the <span id="docs-link"></span> or the <span id="examples-link"></span>, if you prefer to learn by code.
