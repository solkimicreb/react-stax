import appStore, { fetchBeers } from './appStore'
import { beers } from './api'
jest.mock('./api')

describe('Beer finder app store', () => {
  test('should fetch beers', async () => {
    const beerFetching = fetchBeers('dummy')
    expect(appStore.isLoading).toBe(true)
    await beerFetching
    expect(appStore.isLoading).toBe(false)
    expect(appStore.beers).toEqual(beers.dummy)
  })
})
