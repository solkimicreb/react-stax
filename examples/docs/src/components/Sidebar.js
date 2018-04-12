import React, { Component, Fragment } from 'react';
import { store, view, path } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, ease, layout } from './theme';

export const sidebarStore = store({
  open: !layout.isMobile,
  hasSidebar: false
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
  left: 0;
  z-index: 40;
  padding: 10px;
  border-right: 1px solid #ddd;
  width: ${layout.sidebarWidth}px;
  margin-top: ${layout.topbarHeight}px;
  background-color: ${colors.backgroundLight};
  transition: transform 0.15s ${props => (props.open ? ease.out : ease.in)};
  transform: ${props =>
    `translateX(${props.open ? 0 : -layout.sidebarWidth}px)`};
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, ${props => (props.open ? 0.8 : 0)});
  pointer-events: ${props => (props.open ? 'unset' : 'none')};
  transition: background-color 0.15s
    ${props => (props.open ? ease.out : ease.in)};
  z-index: 20;
`;

class Sidebar extends Component {
  componentDidMount = () => (sidebarStore.hasSidebar = true);
  componentWillUnmount = () => (sidebarStore.hasSidebar = false);

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        <StyledSidebar open={sidebarStore.open || !layout.isMobile}>
          {children}
        </StyledSidebar>
        <Backdrop open={sidebarStore.open && layout.isMobile} onClick={close} />
      </Fragment>
    );
  }
}

export default view(Sidebar);
