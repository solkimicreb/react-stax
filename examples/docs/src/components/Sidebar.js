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

const onTouchStart = ev => {
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
};

const onTouchMove = ev => {
  const { isTouching, sidebar, backdrop } = sidebarStore;
  const touchX = ev.touches[0].pageX;
  if (isTouching && touchX <= layout.sidebarWidth) {
    sidebarStore.touchDiff = touchX - sidebarStore.touchX;
    sidebarStore.touchX = touchX;
    sidebar.style.transform = `translateX(${touchX}px)`;
    backdrop.style.opacity = touchX / layout.sidebarWidth * 0.7;
  }
};

const onTouchEnd = ev => {
  const { isTouching, sidebar, backdrop, touchDiff } = sidebarStore;

  if (isTouching) {
    if (touchDiff < 0) {
      close();
    } else {
      open();
    }
    sidebar.style.transform = null;
    backdrop.style.opacity = null;
    sidebarStore.isTouching = false;
    sidebarStore.touchDrift = Math.abs(sidebarStore.touchDiff);
    sidebarStore.touchX = 0;
    sidebarStore.touchDiff = 0;
  }
};

window.addEventListener('touchstart', onTouchStart, { passive: true });
window.addEventListener('touchmove', onTouchMove, { passive: true });
window.addEventListener('touchend', onTouchEnd, { passive: true });
window.addEventListener('touchcancel', onTouchEnd, { passive: true });

export function hasSidebar() {
  return Boolean(sidebarStore.sidebar);
}

export function open() {
  sidebarStore.open = true;
  document.body.style.overflow = 'hidden';
}

export function close() {
  sidebarStore.open = false;
  document.body.style.overflow = null;
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
  z-index: ${props => (props.isMobile ? 70 : 10)};
  padding: 10px;
  border-right: 1px solid #ddd;
  width: ${layout.sidebarWidth}px;
  padding-top: ${props => (props.isMobile ? 0 : layout.topbarHeight) + 10}px;
  background-color: ${colors.backgroundLight};
  transition: ${props => (props.isTouching ? 'none' : 'transform')};
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  transform: translateX(${props => (props.open ? layout.sidebarWidth : 0)}px);
  will-change: transform;
  contain: strict;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.text};
  opacity: ${props => (props.open ? 0.7 : 0)};
  pointer-events: ${props => (props.open ? 'unset' : 'none')};
  transition: ${props => (props.isTouching ? 'none' : 'opacity')};
  transition-duration: ${props => 0.15}s;
  transition-timing-function: ${props => (props.open ? ease.out : ease.in)};
  z-index: 60;
  will-change: opacity;
  contain: strict;
`;

const sidebarRef = sidebar => (sidebarStore.sidebar = sidebar);
const backdropRef = backdrop => (sidebarStore.backdrop = backdrop);

export default view(({ children }) => {
  return (
    <Fragment>
      <StyledSidebar
        open={sidebarStore.open || !layout.isMobile}
        isMobile={layout.isMobile}
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
});
