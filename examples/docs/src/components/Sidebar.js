import React, { Component, Fragment } from 'react';
import { store, view, path } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, ease, layout } from './theme';

export const sidebarStore = store({
  open: !layout.isMobile,
  hasSidebar: false,
  touchX: 0,
  touchDiff: 0
});

window.addEventListener('touchstart', ev => {
  const touchX = ev.touches[0].pageX;
  // improve this!
  if (
    layout.isMobile &&
    ((sidebarStore.open && touchX > layout.sidebarWidth - layout.touchZone) ||
      touchX < layout.touchZone)
  ) {
    sidebarStore.open = false;
    sidebarStore.touchX = Math.min(touchX, layout.sidebarWidth);
    sidebarStore.touchDiff = 0;
  }
});

window.addEventListener('touchend', ev => {
  if (sidebarStore.touchX) {
    sidebarStore.open = sidebarStore.touchDiff > 0;
    sidebarStore.touchX = sidebarStore.touchDiff = 0;
  }
});

window.addEventListener('touchcancel', ev => {
  if (sidebarStore.touchX) {
    sidebarStore.open = sidebarStore.touchDiff > 0;
    sidebarStore.touchX = sidebarStore.touchDiff = 0;
  }
});

window.addEventListener('touchmove', ev => {
  const touchX = ev.touches[0].pageX;
  if (sidebarStore.touchX && touchX <= layout.sidebarWidth) {
    sidebarStore.touchDiff = touchX - sidebarStore.touchX;
    sidebarStore.touchX = touchX;
  }
});

export function hasSidebar() {
  return sidebarStore.hasSidebar;
}

export function close() {
  sidebarStore.open = false;
}

export function toggle() {
  sidebarStore.open = !sidebarStore.open;
}

const StyledSidebar = styled.nav`
  position: fixed;
  top: 0;
  bottom: 0;
  left: ${-layout.sidebarWidth}px;
  z-index: 40;
  padding: 10px;
  border-right: 1px solid #ddd;
  width: ${layout.sidebarWidth}px;
  margin-top: ${layout.topbarHeight}px;
  background-color: ${colors.backgroundLight};
  transition: ${props => (props.isTouching ? 'none' : 'transform 0.15s')};
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  transform: translateX(
    ${props => (props.open ? layout.sidebarWidth : props.touchX)}px
  );
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(
    0,
    0,
    0,
    ${props => (props.open ? 0.8 : props.touchX / layout.sidebarWidth * 0.8)}
  );
  pointer-events: ${props => (props.open ? 'unset' : 'none')};
  transition: ${props =>
    props.isTouching ? 'none' : 'background-color 0.15s'};
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  z-index: 20;
`;

class Sidebar extends Component {
  componentDidMount = () => (sidebarStore.hasSidebar = true);
  componentWillUnmount = () => (sidebarStore.hasSidebar = false);

  render() {
    const { children } = this.props;
    return (
      <Fragment>
        <StyledSidebar
          open={sidebarStore.open || !layout.isMobile}
          touchX={sidebarStore.touchX}
          isTouching={sidebarStore.touchDiff}
        >
          {children}
        </StyledSidebar>
        <Backdrop
          open={sidebarStore.open && layout.isMobile}
          onClick={close}
          touchX={sidebarStore.touchX}
          isTouching={sidebarStore.touchDiff}
        />
      </Fragment>
    );
  }
}

export default view(Sidebar);
