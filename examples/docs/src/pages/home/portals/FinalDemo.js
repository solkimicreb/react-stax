import React from "react";

export default function render({ view, store, params, Router, Link, fetch }) {
  const beers = store({
    list: [],
    selected: {}
  });

  const fetchBeers = () =>
    fetch(`https://pokedex.com/pokemons?name=${params.filter}`)
      .then(res => res.json())
      .then(list => (beers.list = list.error ? [] : list));

  const fetchBeer = () =>
    fetch(`https://pokedex.com/pokemons/${params.id}`)
      .then(res => res.json())
      .then(beer => (beers.selected = beer || {}));

  const updateFilter = ev => (params.filter = ev.target.value);

  async function onRoute({ toPage }) {
    if (toPage === "list") {
      params.filter = params.filter || "";
      await fetchBeers();
    } else if (toPage === "details") {
      await fetchBeer();
    }
  }

  const List = view(() => (
    <div>
      <input value={params.filter} onChange={updateFilter} />
      <button onClick={fetchBeers}>Search beers</button>
      <ul>
        {beers.list.map(beer => (
          <li key={beer.id}>
            <Link to="/details" params={{ id: beer.id }}>
              {beer.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ));

  const Details = view(() => (
    <div>
      <h4>{beers.selected.name}</h4>
      <img src={beers.selected.img} />
    </div>
  ));

  return () => (
    <Router defaultPage="list" onRoute={onRoute}>
      <List page="list" />
      <Details page="details" />
    </Router>
  );
}
