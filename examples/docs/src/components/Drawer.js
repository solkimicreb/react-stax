import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { store, view, path } from 'react-stax'
import styled, { keyframes } from 'styled-components'
import { colors, ease, layout } from './theme'

const drawers = new Set()
const backdrop = React.createRef()

export const touchStore = store({
  touchX: 0,
  touchXDiff: 0
})

const onTouchStart = ev => {
  touchStore.touchX = ev.touches[0].pageX
  const hasOpenDrawer = Array.from(drawers).some(drawer => drawer.props.open)
  const windowWidth = window.innerWidth

  drawers.forEach(drawer => {
    let { right, docked, open, touchZone } = drawer.props
    if (docked) {
      return
    }

    const drawerNode = drawer.ref.current
    const backdropNode = backdrop.current
    const touchX = right ? windowWidth - touchStore.touchX : touchStore.touchX

    if (open || (!hasOpenDrawer && touchX < touchZone)) {
      drawerNode.style.transition = 'none'
      drawer.isTouching = true
      drawer.forceUpdate()

      if (backdropNode) {
        backdropNode.style.transition = 'none'
      }
    }
  })
}

const onTouchMove = ev => {
  const windowWidth = window.innerWidth
  const touchX = ev.touches[0].pageX
  touchStore.touchXDiff = touchX - touchStore.touchX

  drawers.forEach(drawer => {
    const { right, open } = drawer.props
    if (!drawer.isTouching) {
      return
    }

    const drawerNode = drawer.ref.current
    const backdropNode = backdrop.current
    const drawerWidth = drawerNode.offsetWidth
    const absTouchX = right ? windowWidth - touchX : touchX

    if (absTouchX <= drawerWidth) {
      let transformX = right ? -absTouchX : absTouchX
      let correction = open ? Math.max(drawerWidth - touchStore.touchX, 0) : 0
      transformX = right
        ? Math.max(transformX - correction, -drawerWidth)
        : Math.min(transformX + correction, drawerWidth)

      drawerNode.style.transform = `translateX(${transformX}px)`
      if (backdropNode) {
        backdropNode.style.opacity = (absTouchX / drawerWidth) * 0.7
      }
    }
  })
}

const onTouchEnd = ev => {
  drawers.forEach(drawer => {
    const { right, onOpen, onClose } = drawer.props

    const drawerNode = drawer.ref.current
    const touchXDiff = right ? -touchStore.touchXDiff : touchStore.touchXDiff

    if (drawer.isTouching) {
      if (0 < touchXDiff) {
        onOpen()
      } else {
        onClose()
      }
      drawer.isTouching = false
      drawerNode.style.transform = null
      drawerNode.style.transition = null
    }
  })

  const backdropNode = backdrop.current
  if (backdropNode) {
    backdropNode.style.opacity = null
    backdropNode.style.transition = null
  }

  touchStore.touchX = 0
  touchStore.touchXDiff = 0
}

// TODO: allow touch through chat iframe!!
window.addEventListener('touchstart', onTouchStart, { passive: true })
window.addEventListener('touchmove', onTouchMove, { passive: true })
window.addEventListener('touchend', onTouchEnd, { passive: true })
window.addEventListener('touchcancel', onTouchEnd, { passive: true })

const StyledDrawer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.right ? 'unset' : `${-props.width}px`)};
  right: ${props => (props.right ? `${-props.width}px` : 'unset')};
  bottom: 0;
  width: ${props => props.width}px;
  z-index: ${props => (!props.docked ? 70 : 10)};
  padding-top: ${props => (!props.docked ? 0 : layout.topbarHeight)}px;
  transition: transform;
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  transform: translateX(
    ${props =>
      props.open || props.docked ? (props.right ? '-100%' : '100%') : 'none'}
  );
  overflow: scroll;
  will-change: transform;
  contain: strict;
`

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.text};
  opacity: ${props => (props.open && !props.docked ? 0.7 : 0)};
  transition: opacity;
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  z-index: 60;
  will-change: opacity;
  contain: strict;
`

const Register = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  z-index: 200;
`

class Drawer extends Component {
  ref = React.createRef()
  isTouching = false

  componentDidMount() {
    drawers.add(this)
  }

  componentWillUnmount() {
    drawers.delete(this)
  }

  render() {
    let { width, right, docked, onClose, open, children } = this.props
    width = Math.min(window.innerWidth, width)

    return (
      <Fragment>
        <StyledDrawer
          open={open}
          width={width}
          right={right}
          docked={docked}
          innerRef={this.ref}
        >
          {children}
        </StyledDrawer>
        {(open || this.isTouching) && (
          <Backdrop
            open={open}
            docked={docked}
            onClick={onClose}
            innerRef={backdrop}
          />
        )}
      </Fragment>
    )
  }

  componentDidUpdate() {
    document.body.style.overflow = this.props.open ? 'hidden' : null
  }
}

export default view(Drawer)

/*ReactDOM.render(
  <Register
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
    onTouchCancel={onTouchEnd}
  />,
  document.getElementById('touch-register')
)*/
