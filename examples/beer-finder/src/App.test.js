import React from 'react'
import TestRenderer from 'react-test-renderer'
import SearchBar from 'material-ui-search-bar'
import { LinearProgress } from 'material-ui/Progress'
import textContent from 'react-addons-text-content'
import Beer from './Beer'
import BeerList from './BeerList'
import appStore from './appStore'
import App from './App'
import { beers, beerFetching } from './api'

jest.mock('./api')

describe('Beer finder app', () => {
  const { root: app } = TestRenderer.create(<App />)

  test('should fetch beers', async () => {
    expect(app.findAllByType(Beer)).toHaveLength(0)
    expect(app.findAllByType(LinearProgress)).toHaveLength(0)

    app.findByType(SearchBar).props.onRequestSearch('yummy')

    expect(app.findAllByType(LinearProgress)).toHaveLength(1)
    await beerFetching
    expect(app.findAllByType(Beer)).toHaveLength(1)
    expect(app.findAllByType(LinearProgress)).toHaveLength(0)
  })

  test("should fallback to 'No matching beers found!'", async () => {
    app.findByType(SearchBar).props.onRequestSearch('exotic')

    await beerFetching
    expect(app.findAllByType(Beer)).toHaveLength(0)
    expect(textContent(app.findByType(BeerList).children)).toBe(
      'No matching beers found!'
    )
  })
})
