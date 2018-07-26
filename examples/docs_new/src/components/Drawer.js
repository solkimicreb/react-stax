import React, { Component, Fragment } from 'react';
import { store, view, path } from 'react-easy-stack';
import styled, { keyframes } from 'styled-components';
import { colors, ease, layout } from './theme';

const TOUCH_ZONE = 20;
const drawers = new Set();
const backdrop = React.createRef();

export const touchStore = store({
  touchX: 0,
  touchDiff: 0,
  touchStart: 0
});

const onTouchStart = ev => {
  const windowWidth = window.innerWidth;
  touchStore.touchX = ev.touches[0].pageX;
  touchStore.touchStart = Date.now();

  let hasOpenDrawer = Array.from(drawers).some(drawer => drawer.props.open);

  drawers.forEach(drawer => {
    let { width, right, docked, open } = drawer.props;
    if (docked) {
      return;
    }
    width = Math.min(windowWidth, width);
    const touchX = right ? windowWidth - touchStore.touchX : touchStore.touchX;

    if (
      (!open && !hasOpenDrawer && touchX < TOUCH_ZONE) ||
      (open && Math.abs(touchX - width) < TOUCH_ZONE)
    ) {
      drawer.store.isTouching = true;
    }
  });
};

const onTouchMove = ev => {
  const windowWidth = window.innerWidth;
  const touchX = ev.touches[0].pageX;
  touchStore.touchDiff = touchX - touchStore.touchX;
  touchStore.touchX = touchX;

  drawers.forEach(drawer => {
    let { width, right } = drawer.props;
    width = Math.min(windowWidth, width);
    const touchX = right ? windowWidth - touchStore.touchX : touchStore.touchX;

    if (drawer.store.isTouching && touchX <= width) {
      const transformX = right ? -touchX : touchX;
      drawer.ref.current.style.transform = `translateX(${transformX}px)`;
      if (backdrop.current) {
        backdrop.current.style.opacity = (touchX / width) * 0.7;
      }
    }
  });
};

const onTouchEnd = ev => {
  const touchTime = Date.now() - touchStore.touchStart;

  drawers.forEach(drawer => {
    let touchDiff = touchStore.touchDiff;
    if (drawer.props.right) {
      touchDiff = -touchDiff;
    }

    if (drawer.store.isTouching) {
      drawer.store.isTouching = false;
      if (0 < touchDiff) {
        drawer.props.onOpen();
      } else {
        drawer.props.onClose();
      }

      drawer.ref.current.style.transform = null;
    }
  });
  if (backdrop.current) {
    backdrop.current.style.opacity = null;
  }

  touchStore.touchX = 0;
  touchStore.touchDiff = 0;
};

window.addEventListener('touchstart', onTouchStart, { passive: true });
window.addEventListener('touchmove', onTouchMove, { passive: true });
window.addEventListener('touchend', onTouchEnd, { passive: true });
window.addEventListener('touchcancel', onTouchEnd, { passive: true });

const slideFromLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
`;

const slideFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
`;

const StyledDrawer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.right ? 'unset' : `${-props.width}px`)};
  right: ${props => (props.right ? `${-props.width}px` : 'unset')};
  bottom: 0;
  width: ${props => props.width}px;
  z-index: ${props => (!props.docked ? 70 : 10)};
  padding-top: ${props => (!props.docked ? 0 : layout.topbarHeight)}px;
  transition: ${props => (props.isTouching ? 'none' : 'transform')};
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  transform: translateX(
    ${props =>
      props.open || props.docked ? (props.right ? '-100%' : '100%') : 'none'}
  );
  overflow: scroll;
  will-change: transform;
  contain: strict;
  animation: ${props => (props.right ? slideFromRight : slideFromLeft)} 0.15s;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.text};
  opacity: ${props => (props.open && !props.docked ? 0.7 : 0)};
  pointer-events: ${props => (props.open ? 'unset' : 'none')};
  transition: ${props => (props.isTouching ? 'none' : 'opacity')};
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  z-index: 60;
  will-change: opacity;
  contain: strict;
`;

class Drawer extends Component {
  ref = React.createRef();

  constructor(props) {
    super(props);

    this.store = store({
      open: props.open,
      isTouching: false
    });
  }

  componentDidMount() {
    drawers.add(this);
  }

  componentWillUnmount() {
    drawers.delete(this);
  }

  render() {
    let { width, right, docked, onClose, open, children } = this.props;
    const { isTouching } = this.store;
    width = Math.min(window.innerWidth, width);

    return (
      <Fragment>
        <StyledDrawer
          open={open}
          width={width}
          right={right}
          docked={docked}
          isTouching={isTouching}
          innerRef={this.ref}
        >
          {children}
        </StyledDrawer>
        {(open || isTouching) && (
          <Backdrop
            open={open}
            isTouching={isTouching}
            docked={docked}
            onClick={onClose}
            innerRef={backdrop}
          />
        )}
      </Fragment>
    );
  }
}

export default view(Drawer);
