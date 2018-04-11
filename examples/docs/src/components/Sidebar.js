import React from 'react';
import { store, view, path, Switch } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, ease, layout } from './theme';
import MenuIcon from 'react-icons/lib/fa/bars';

const mql = window.matchMedia(
  `(min-width: ${layout.appWidth + layout.sidebarWidth}px)`
);
export const sidebarStore = store({
  docked: mql.matches,
  open: mql.matches,
  touchX: 0,
  touchDiff: 0
});

window.addEventListener('touchstart', ev => {
  const touchX = ev.touches[0].pageX;
  if (
    !sidebarStore.docked &&
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

mql.addListener(() => (sidebarStore.open = sidebarStore.docked = mql.matches));

export function isDocked() {
  return sidebarStore.docked;
}

export function close() {
  if (!sidebarStore.docked) {
    sidebarStore.open = false;
  }
}

function toggle() {
  if (!sidebarStore.docked) {
    sidebarStore.open = !sidebarStore.open;
  }
}

function preventTouch(ev) {
  ev.stopPropagation();
}

export const Toggle = view(() => (
  <Switch page="docs">
    {sidebarStore.docked && (
      <span onClick={toggle} onTouchStart={preventTouch}>
        <MenuIcon />
      </span>
    )}
  </Switch>
));

const StyledSidebar = styled.nav`
  position: fixed;
  top: 0;
  left: -250px;
  bottom: 0;
  width: ${layout.sidebarWidth}px;
  margin-top: ${layout.topbarHeight}px;
  overflow-y: scroll;
  z-index: 40;
  border-right: 1px solid #ddd;
  padding: 10px;
  background-color: ${colors.backgroundLight}
  transition: ${props => (props.touchX ? 'none' : `transform 0.1s`)};
  transform: ${props =>
    `translateX(${props.open ? layout.sidebarWidth : props.touchX}px)`};
`;

export default view(({ children }) => (
  <StyledSidebar open={sidebarStore.open} touchX={sidebarStore.touchX}>
    {children}
  </StyledSidebar>
));
