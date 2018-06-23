import React, { Component, Fragment } from 'react';
import { store, view, path } from 'react-easy-stack';
import styled from 'styled-components';
import Drawer from './Drawer2';
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

const StyledDrawer = styled(Drawer)``;

export default view(({ children }) => {
  return (
    <StyledDrawer
      width={layout.sidebarWidth}
      open={sidebarStore.open}
      docked={!layout.isMobile}
    >
      {children}
    </StyledDrawer>
  );
});
