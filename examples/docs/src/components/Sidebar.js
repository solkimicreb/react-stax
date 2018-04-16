import React, { Component, Fragment } from 'react';
import { store, view, path } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, ease, layout } from './theme';

export const sidebarStore = store({
  open: !layout.isMobile,
  sidebar: undefined,
  backdrop: undefined,
  isTouching: false,
  touchX: 0,
  touchDiff: 0
});

window.addEventListener('touchstart', ev => {
  const touchX = ev.touches[0].pageX;
  if (
    sidebarStore.sidebar &&
    sidebarStore.backdrop &&
    layout.isMobile &&
    ((sidebarStore.open && touchX > layout.sidebarWidth - layout.touchZone) ||
      touchX < layout.touchZone)
  ) {
    sidebarStore.isTouching = true;
  }
});

window.addEventListener('touchmove', ev => {
  const { isTouching, sidebar, backdrop } = sidebarStore;
  const touchX = ev.touches[0].pageX;
  if (isTouching && touchX <= layout.sidebarWidth) {
    sidebarStore.touchDiff = touchX - sidebarStore.touchX;
    sidebarStore.touchX = touchX;
    sidebar.style.transform = `translateX(${touchX}px)`;
    backdrop.style.backgroundColor = `rgba(0, 0, 0, ${touchX /
      layout.sidebarWidth *
      0.8})`;
  }
});

const onTouchEnd = ev => {
  const { isTouching, sidebar, backdrop, touchDiff } = sidebarStore;

  if (isTouching) {
    if (touchDiff < 0) {
      close();
    } else {
      open();
    }
    sidebar.style.transform = null;
    backdrop.style.backgroundColor = null;
    sidebarStore.isTouching = false;
    sidebarStore.touchX = 0;
    sidebarStore.touchDiff = 0;
  }
};
window.addEventListener('touchend', onTouchEnd);
window.addEventListener('touchcancel', onTouchEnd);

export function hasSidebar() {
  return Boolean(sidebarStore.sidebar);
}

export function open() {
  sidebarStore.open = true;
  if (layout.isMobile) {
    document.body.style.overflow = 'hidden';
  }
}

export function close() {
  sidebarStore.open = false;
  document.body.style.overflow = 'auto';
}

export function toggle() {
  if (!sidebarStore.open) {
    open();
  } else {
    close();
  }
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
  transform: translateX(${props => (props.open ? layout.sidebarWidth : 0)}px);
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, ${props => (props.open ? 0.8 : 0)});
  pointer-events: ${props => (props.open ? 'unset' : 'none')};
  transition: ${props =>
    props.isTouching ? 'none' : 'background-color 0.15s'};
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  z-index: 20;
`;

const sidebarRef = sidebar => (sidebarStore.sidebar = sidebar);
const backdropRef = backdrop => (sidebarStore.backdrop = backdrop);

class Sidebar extends Component {
  render() {
    const { children } = this.props;
    return (
      <Fragment>
        <StyledSidebar
          open={sidebarStore.open || !layout.isMobile}
          isTouching={sidebarStore.isTouching}
          innerRef={sidebarRef}
        >
          {children}
        </StyledSidebar>
        <Backdrop
          open={sidebarStore.open && layout.isMobile}
          isTouching={sidebarStore.isTouching}
          onClick={close}
          innerRef={backdropRef}
        />
      </Fragment>
    );
  }
}

export default view(Sidebar);
