import React, { Component, Fragment } from 'react';
import { store, view, path } from 'react-easy-stack';
import styled from 'styled-components';
import Drawer from './Drawer';
import { colors, ease, layout } from './theme';

export const sidebarStore = store({
  open: !layout.isMobile
});

export function open() {
  sidebarStore.open = true;
}

export function close() {
  sidebarStore.open = false;
}

export function toggle() {
  if (!sidebarStore.open) {
    open();
  } else {
    close();
  }
}

const StyledSidebar = styled.nav`
  height: 100%;
  background-color: ${colors.backgroundLight};
  overflow-y: scroll;
  padding: 10px;
  border-right: 1px solid #ddd;
`;

export default view(({ children }) => {
  return (
    <Drawer
      width={layout.sidebarWidth}
      docked={!layout.isMobile}
      open={sidebarStore.open}
      onOpen={open}
      onClose={close}
    >
      <StyledSidebar>{children}</StyledSidebar>
    </Drawer>
  );
});
