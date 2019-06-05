import React from 'react'
import styled from 'styled-components'
import { colors, ease } from './theme'

export default styled.span`
  cursor: pointer;
  font-size: ${props => props.size || 30}px;
  color: ${colors.textLight};
  transition: color 0.2s ${ease.both};

  &:hover,
  &:active {
    color: ${colors.accentLight};
  }
`
