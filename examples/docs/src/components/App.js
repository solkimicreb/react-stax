import React, { Fragment } from 'react'
import { view, store, path } from 'react-stax'
import styled from 'styled-components'
import { colors, layout, ease } from './theme'
import * as sidebar from './Sidebar'
import Button from './Button'

const StyledApp = styled.main`
  position: relative;
  left: ${props => props.correction / 2}px
  max-width: ${layout.appWidth}px;
  margin: ${layout.topbarHeight}px auto;
  margin-bottom: 0;
  will-change: left;
`

export default view(({ children }) => (
  <StyledApp correction={layout.correction}>{children}</StyledApp>
))
