import React from 'react';

export default function render({ view, store }) {
  const beers = store([]);

  function getRandomBeer() {
    return fetch('https://api.punkapi.com/v2/beers/random')
      .then(res => res.json())
      .then(json => beers.push(json[0]));
  }

  return view(() => (
    <div>
      <button onClick={getRandomBeer}>Get a random beer</button>
      <ul>{beers.map(beer => <li>{beer.name}</li>)}</ul>
    </div>
  ));
}
