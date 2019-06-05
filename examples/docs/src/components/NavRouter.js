import React, { Component } from 'react'
import styled from 'styled-components'
import { Router, view } from 'react-stax'
import { ease, layout } from './theme'

const StyledRouter = styled(Router)`
  > * {
    will-change: opacity;
  }
`

class NavRouter extends Component {
  enterAnimation = elem => {
    return elem.animate({ opacity: [0, 1] }, { duration: 150 }).finished
  };

  leaveAnimation = (elem, ctx) => {
    const { top, left, width, height } = elem.getBoundingClientRect()

    Object.assign(elem.style, {
      position: 'fixed',
      top: `${top - 10}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`
    })

    return elem.animate({ opacity: [1, 0] }, { duration: 150 }).finished
  };

  render () {
    const { children, ...rest } = this.props

    const enterAnimation = layout.isMobile ? undefined : this.enterAnimation
    const leaveAnimation = layout.isMobile ? undefined : this.leaveAnimation

    return (
      <StyledRouter
        {...rest}
        enterAnimation={this.enterAnimation}
        leaveAnimation={this.leaveAnimation}
        slave
        debug='nav'
      >
        {children}
      </StyledRouter>
    )
  }
}

export default view(NavRouter)
