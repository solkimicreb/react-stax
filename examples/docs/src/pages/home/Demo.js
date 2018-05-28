import React from 'react';
import { view, store, params, Router, Link } from 'react-easy-stack';

const beers = store({
  list: [],
  selected: {}
});

function fetchBeers() {
  return fetch(`https://api.punkapi.com/v2/beers?food=${params.filter}`)
    .then(res => res.json())
    .then(list => (beers.list = list));
}

function fetchBeer() {
  return fetch(`https://api.punkapi.com/v2/beers/${params.id}`)
    .then(res => res.json())
    .then(list => (beers.selected = list[0]));
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
    <p>
      <b>Name:</b> {beers.selected.name}
    </p>
    <p>
      <b>Description:</b> {beers.selected.description}
    </p>
  </div>
));

export default () => (
  <Router defaultPage="list" onRoute={onRoute}>
    <List page="list" />
    <Details page="details" />
  </Router>
);
