import React from 'react'
import { Router, view } from 'react-easy-stack'
import styled from 'styled-components'
import { layout } from './theme'

const StyledRouter = styled(Router)`
  overflow: hidden;

  > * {
    will-change: ${props => (props.isMobile ? 'transform' : 'opacity')};
  }
`

const enterAnimation = (elem, ctx) => {
  // get the page and make decisions based on it!!
  return elem.animate(
    layout.isMobile
      ? {
          transform: ['translateX(-100%)', 'none']
        }
      : { opacity: [0, 1] },
    { duration: layout.isMobile ? 220 : 1500, fill: 'both' }
  ).finished
}

const leaveAnimation = (elem, ctx) => {
  const { top, left, width, height } = elem.getBoundingClientRect()

  Object.assign(elem.style, {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  })

  return elem.animate(
    layout.isMobile
      ? {
          transform: ['none', 'translateX(100%)']
        }
      : { opacity: [1, 0] },
    { duration: layout.isMobile ? 220 : 1500, fill: 'both' }
  ).finished
}

export default view(({ children, ...rest }) => (
  <StyledRouter
    {...rest}
    enterAnimation={enterAnimation}
    leaveAnimation={leaveAnimation}
    isMobile={layout.isMobile}
  >
    {children}
  </StyledRouter>
))
