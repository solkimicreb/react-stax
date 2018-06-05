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