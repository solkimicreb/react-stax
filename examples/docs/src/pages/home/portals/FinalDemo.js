import React from 'react';

export default function render({ view, store, params, Router, Link }) {
  const beers = store({
    list: [],
    selected: {}
  });
  params.filter = params.filter || 'apple';

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
        <Link to="../details" params={{ id: beer.id }} key={beer.id}>
          {beer.name}
        </Link>
      ))}
    </div>
  ));

  const Details = view(() => (
    <div>
      <Link to="../list">Beers list</Link>
      <p>Name: {beers.selected.name}</p>
      <p>Description: {beers.selected.description}</p>
    </div>
  ));

  return () => (
    <Router defaultPage="list" onRoute={onRoute}>
      <List page="list" />
      <Details page="details" />
    </Router>
  );
}
