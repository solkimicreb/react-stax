import React, { Component, Fragment } from 'react';
import { store, view, path } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, ease, layout } from './theme';

const TOUCH_ZONE = 10;

export const touchStore = store({
  isTouching: false,
  touchX: 0,
  touchDiff: 0
});

const onTouchStart = ev => {
  const touchX = ev.touches[0].pageX;
  touchStore.touchStart = touchX;
  touchStore.touchX = touchX;
  touchStore.isTouching = true;
  if (touchX < TOUCH_ZONE || window.innerWidth - TOUCH_ZONE < touchX) {
  }
};

const onTouchMove = ev => {
  const touchX = ev.touches[0].pageX;
  touchStore.touchDiff = touchX - touchStore.touchX;
  touchStore.touchX = touchX;
};

const onTouchEnd = ev => {
  touchStore.isTouching = false;
  touchStore.touchX = 0;
  touchStore.touchDiff = 0;
  touchStore.touchStart = 0;
};

window.addEventListener('touchstart', onTouchStart, { passive: true });
window.addEventListener('touchmove', onTouchMove, { passive: true });
window.addEventListener('touchend', onTouchEnd, { passive: true });
window.addEventListener('touchcancel', onTouchEnd, { passive: true });

const StyledDrawer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => -props.width}px;
  bottom: 0;
  width: 250px;
  z-index: ${props => (props.isMobile ? 70 : 10)};
  overflow-y: scroll;
  padding: 10px;
  border-right: 1px solid #ddd;
  padding-top: ${props => (props.isMobile ? 0 : layout.topbarHeight) + 10}px;
  background-color: ${colors.backgroundLight};
  transition: ${props => (props.isTouching ? 'none' : 'transform')};
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  transform: translateX(
    ${props =>
      props.isTouching ? `${props.touchX}px` : props.open ? '100%' : 'none'}
  );
  z-index: ${props => (props.isMobile ? 70 : 10)};
  will-change: transform;
  contain: strict;
`;

// TODO: add gradual fading!!
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: ${props => props.width}px;
  background-color: ${colors.text};
  opacity: ${props =>
    props.isTouching ? props.touchRatio * 0.7 : props.open ? 0.7 : 0};
  pointer-events: ${props => (props.open ? 'unset' : 'none')};
  transition: ${props => (props.isTouching ? 'none' : 'opacity')};
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  z-index: 60;
  will-change: opacity;
  contain: strict;
`;

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.store = store({
      isOpen: props.open
    });
  }

  static deriveStoresFromProps(props, store) {
    store.isOpen = props.open;
  }

  close = () => (this.store.isOpen = false);

  render() {
    const { isOpen } = this.store;
    const { children, left, width } = this.props;
    const { touchX, touchDiff, touchStart } = touchStore;

    let isTouching;
    let touchRatio;

    if (touchStore.isTouching) {
      if (left) {
        if (isOpen && Math.abs(width - touchStart) < TOUCH_ZONE) {
          isTouching = touchX <= width;
          touchRatio = touchX / width;
          this.store.isOpen = 0 <= touchDiff;
        } else if (!isOpen && touchStart < TOUCH_ZONE) {
          console.log('INSIDE!!', touchStart);
          isTouching = touchX <= width;
          touchRatio = touchX / width;
          this.store.isOpen = 0 <= touchDiff;
        }
      } else {
        const windowWidth = window.innerWidth;
        isTouching = windowWidth - width < touchX;
        touchRatio = (windowWidth - touchX) / width;
        this.store.isOpen = touchDiff < 0;
      }
    }

    console.log('touchX', touchX, touchDiff, touchRatio, isTouching, isOpen);

    if (!isOpen && !isTouching) {
      return null;
    }

    return (
      <Fragment>
        <StyledDrawer
          width={width}
          open={isOpen}
          isMobile={layout.isMobile}
          isTouching={isTouching}
          touchX={touchX}
        >
          {children}
        </StyledDrawer>
        <Backdrop
          open={isOpen}
          isTouching={isTouching}
          touchRatio={touchRatio}
          onClick={this.close}
        />
      </Fragment>
    );
  }
}

export default view(Drawer);
