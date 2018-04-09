import React from 'react';
import { store, view, path } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, ease, layout } from './theme';
import MenuIcon from 'react-icons/lib/fa/bars';

const mql = window.matchMedia(
  `(min-width: ${layout.appWidth + layout.sidebarWidth}px)`
);
export const sidebarStore = store({
  docked: mql.matches,
  open: mql.matches
});

mql.addListener(() => (sidebarStore.open = sidebarStore.docked = mql.matches));

function toggle() {
  if (!sidebarStore.docked) {
    sidebarStore.open = !sidebarStore.open;
  }
}

export function isDocked() {
  return sidebarStore.docked;
}

export function close() {
  if (!sidebarStore.docked) {
    sidebarStore.open = false;
  }
}

export const Toggle = view(
  () =>
    sidebarStore.docked ? null : (
      <span onClick={toggle}>
        <MenuIcon />
      </span>
    )
);

const StyledSidebar = styled.nav`
  position: fixed;
  top: ${layout.topbarHeight}px;
  left: 0;
  bottom: 0;
  width: ${layout.sidebarWidth}px;
  z-index: 100;
  border-right: 1px solid #ddd;
  padding: 10px;
  background-color: ${colors.backgroundLight}
  transition: all 0.1s ${props => (props.open ? ease.out : ease.in)};
  transform: ${props => (props.open ? 'none' : 'translateX(-250px)')};
`;

export default view(({ children }) => (
  <StyledSidebar open={sidebarStore.open && path[0] === 'docs'}>
    {children}
  </StyledSidebar>
));
