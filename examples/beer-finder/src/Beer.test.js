import React from 'react'
import TestRenderer from 'react-test-renderer'
import textContent from 'react-addons-text-content'
import Card, { CardMedia } from 'material-ui/Card'
import { beers } from './api'
import Beer from './Beer'

jest.mock('./api')

describe('Beer items', () => {
  const { root: beer } = TestRenderer.create(<Beer {...beers.yummy[0]} />)
  const card = beer.findByType(Card)

  test('should toggle beer data', async () => {
    expect(textContent(card)).toBe('Yummy Beeryummy duck')
    expect(card.findAllByType(CardMedia)).toHaveLength(1)
    card.props.onClick()

    expect(textContent(card)).toBe('Yummy BeerA strangely yummy beer.')
    expect(card.findAllByType(CardMedia)).toHaveLength(0)
  })
})
