import React from "react";

export default function render({ view, store, fetch }) {
  const beers = store([]);

  const getRandomBeer = () =>
    fetch("https://api.punkapi.com/v2/beers/random")
      .then(res => res.json())
      .then(json => beers.push(json[0]));

  return view(() => (
    <div>
      <button onClick={getRandomBeer}>Get a random beer</button>
      <ul>
        {beers.map(beer => (
          <li key={beer.id}>{beer.name}</li>
        ))}
      </ul>
    </div>
  ));
}
