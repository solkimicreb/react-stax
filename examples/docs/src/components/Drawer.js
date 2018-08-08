import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { store, view, path } from 'react-stax'
import styled, { keyframes } from 'styled-components'
import { colors, ease, layout } from './theme'

const drawers = new Set()
const backdrop = React.createRef()

export const touchStore = store({
  touchStart: 0,
  touchDiff: 0
})

const onTouchStart = ev => {
  touchStore.touchStart = ev.touches[0].pageX
  const hasOpenDrawer = Array.from(drawers).some(drawer => drawer.props.open)
  const windowWidth = window.innerWidth

  for (const drawer of drawers) {
    const { right, docked, open, touchZone } = drawer.props
    if (docked) {
      continue
    }

    const drawerNode = drawer.ref.current
    const backdropNode = backdrop.current
    const distance = right
      ? windowWidth - touchStore.touchStart
      : touchStore.touchStart

    if (open || (!hasOpenDrawer && distance < touchZone)) {
      drawerNode.style.transition = 'none'
      drawer.isTouching = true
      drawer.forceUpdate()

      if (backdropNode) {
        backdropNode.style.transition = 'none'
      }

      // break after the first open loader is handled
      break
    }
  }
}

const onTouchMove = ev => {
  const windowWidth = window.innerWidth
  const touchX = ev.touches[0].pageX
  touchStore.touchDiff = touchX - touchStore.touchX

  for (const drawer of drawers) {
    const { right, open, touchZone } = drawer.props
    if (!drawer.isTouching) {
      continue
    }

    const drawerNode = drawer.ref.current
    const backdropNode = backdrop.current
    const drawerWidth = drawerNode.offsetWidth
    // distance is the (absolute) distance from the edge of the window
    const distance = right ? windowWidth - touchX : touchX
    const initialDistance = right
      ? windowWidth - touchStore.touchStart
      : touchStore.touchStart

    // move the drawer if the touch position is inside it
    if (distance <= drawerWidth + touchZone) {
      // transformX is the part of the drawer that should be outside the screen
      let transform = distance - drawerWidth
      if (right) {
        transform = -transform
      }
      // correction is relevant if the inital touch was inside the drawer
      const correction = open ? Math.max(drawerWidth - initialDistance, 0) : 0

      // do not let the drawer transform to be bigger then 0
      transform = right
        ? Math.max(transform - correction, 0)
        : Math.min(transform + correction, 0)

      drawerNode.style.transform = `translateX(${transform}px)`
      if (backdropNode) {
        backdropNode.style.opacity = (distance / drawerWidth) * 0.7
      }
    } else {
      // fully drawn drawers
      drawerNode.style.transform = `translateX(0)`
      if (backdropNode) {
        backdropNode.style.opacity = 0.7
      }
    }

    // break after the first open loader is handled
    break
  }
}

const onTouchEnd = ev => {
  for (const drawer of drawers) {
    const { right, onOpen, onClose } = drawer.props
    if (!drawer.isTouching) {
      continue
    }

    const drawerNode = drawer.ref.current
    const touchDiff = right ? -touchStore.touchDiff : touchStore.touchDiff

    if (0 < touchDiff) {
      onOpen()
    } else {
      onClose()
    }
    drawer.isTouching = false
    drawerNode.style.transform = null
    drawerNode.style.transition = null

    // break after the first open loader is handled
    break
  }

  const backdropNode = backdrop.current
  if (backdropNode) {
    backdropNode.style.opacity = null
    backdropNode.style.transition = null
  }

  touchStore.touchX = 0
  touchStore.touchDiff = 0
}

// TODO: allow touch through chat iframe!!
window.addEventListener('touchstart', onTouchStart, { passive: true })
window.addEventListener('touchmove', onTouchMove, { passive: true })
window.addEventListener('touchend', onTouchEnd, { passive: true })
window.addEventListener('touchcancel', onTouchEnd, { passive: true })

const StyledDrawer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.right ? null : 0)};
  right: ${props => (props.right ? 0 : null)};
  bottom: 0;
  width: ${props => props.width}px;
  z-index: ${props => (!props.docked ? 70 : 10)};
  padding-top: ${props => (!props.docked ? 0 : layout.topbarHeight)}px;
  transition: transform;
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  transform: translateX(
    ${props =>
      props.open || props.docked ? 0 : props.right ? '100%' : '-100%'}
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
