export const beers = {
  dummy: [{
    name: 'Dummy Beer',
    image_url: 'http://via.placeholder.com/250/ffffff/000000',
    food_pairing: ['duck', 'chocolate'],
    description: 'A strangely dummy beer.'
  }],
  yummy: [{
    name: 'Yummy Beer',
    image_url: 'http://via.placeholder.com/250/ffffff/000000',
    food_pairing: ['yummy duck'],
    description: 'A strangely yummy beer.'
  }]
}

export let beerFetching = Promise.resolve()
export function fetchBeers (filter) {
  beerFetching = Promise.resolve(beers[filter] || [])
  return beerFetching
}