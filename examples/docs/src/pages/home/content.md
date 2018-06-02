# React Easy Stack

> A complete routing and state management solution for practical developers.

React Easy Stack was born from years of practical problem solving. It promotes rapid development and puts product quality before theoretical code beauty. Easy Stack apps should effortlessly meet subtle user expectations - like browser history and URL integration, animated page transitions and routing without a cascade of loaders.

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

Routing is inspired by file systems and the old school. At its simplest form it looks like this.

```jsx
import React from 'react';
import { Router, Link } from 'react-easy-stack';

export default () => (
  <div>
    <Link to="home">Home Link</Link>
    <Link to="settings">Settings Link</Link>
    <Router defaultPage="home">
      <div page="home">Home Page</div>
      <div page="settings">Settings Page</div>
    </Router>
  </div>
);
```

The routing API has three components:

* `Router` is like a folder, think of its child components as files and child routers as subfolders.
* `Link` navigates between the pages.
* `route` is a function for programmatic navigation.

These three provide features like nested and parallel routing, relative and absolute routes, async data resolution, lazy loading, active link styling, scroll management and animated page transitions.

You can take a deeper dive in the <span id="routing-link"></span>.

## State Management

State management focuses on freedom and flexibility. It automatically updates the view on state changes without any restrictions on state structure, placement or manipulation. You can share global state between components with a single object.

```jsx
import React from 'react';
import { view, store } from 'react-easy-stack';

const beers = store([]);

function getRandomBeer() {
  return fetch('https://api.punkapi.com/v2/beers/random')
    .then(res => res.json())
    .then(json => beers.push(json[0]));
}

export default view(() => (
  <div>
    <button onClick={getRandomBeer}>Get a random beer</button>
    <ul>{beers.map(beer => <li>{beer.name}</li>)}</ul>
  </div>
));
```

The state management API has two functions:

* `store` creates reactive stores, which store your data.
* `view` creates reactive views, which re-render when the data mutates.

You can store any kind of data in your stores and mutate them in any way, the necessary components will always re-render to reflect the new data. You could store a mix of deeply nested objects, arrays and Maps, you could add dynamic properties or `delete` them, or maybe use computed getters or inheritance.

The possibilities are endless, learn more about typical state management patterns in the <span id="state-link"></span>.

## Browser integration

Good web pages use the platform. They are shareable by URL and integrate with the browser history. Easy Stack has a few plain objects, which automatically two-way synchronize with the URL and localStorage to offload some integration complexity from you.

```jsx
import React from 'react';
import { view, params } from 'react-easy-stack';

const setFilter = ev => (params.value = ev.target.value);
export default view(() => <input value={params.filter} onChange={setFilter} />);
```

The integrations API has 3 objects:

* `params` is a reactive object, which is always in sync with the URL query parameters. Forget the times when you had to reload a page to change a single query parameter.
* `path` is an array which is in sync with the current URL pathname.
* `storage` is an object, which is in sync with the localStorage. It is perfect for storing session data or offline caching.

You can learn more about common use cases for these objects in the <span id="integrations-link"></span>.

## Final Stuff

```jsx
import React from 'react';
import { view, store, params, Router, Link } from 'react-easy-stack';

const beers = store({
  list: [],
  selected: {}
});

function fetchBeers() {
  return fetch(`https://api.punkapi.com/v2/beers?food=${params.filter}`)
    .then(res => res.json())
    .then(list => (beers.list = list || []));
}

function fetchBeer() {
  return fetch(`https://api.punkapi.com/v2/beers/${params.id}`)
    .then(res => res.json())
    .then(list => (beers.selected = list[0] || {}));
}

async function onRoute({ toPage }) {
  if (toPage === 'list') {
    await fetchBeers();
  } else if (toPage === 'details') {
    await fetchBeer();
  }
}

const updateFilter = ev => (params.filter = ev.target.value);

const List = view(() => (
  <div>
    <input value={params.filter} onChange={updateFilter} />
    <button onClick={fetchBeers}>Search beers</button>
    {beers.list.map(beer => (
      <Link to="../details" params={{ id: beer.id }} key={beer.id}>
        {beer.name}
      </Link>
    ))}
  </div>
));

const Details = view(() => (
  <div>
    <Link to="../list">To beers list</Link>
    <p>Name: {beers.selected.name}</p>
    <p>Description: {beers.selected.description}</p>
  </div>
));

export default () => (
  <Router defaultPage="list" onRoute={onRoute}>
    <List page="list" />
    <Details page="details" />
  </Router>
);
```

<div id="routing-demo"></div>
