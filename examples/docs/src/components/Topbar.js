import React from 'react';
import { view } from 'react-stax';
import { TopLink } from './Link';
import styled from 'styled-components';
import { colors, layout, ease } from './theme';
import * as sidebar from './Sidebar';
import ActionIcons from './ActionIcons';
import { ReactComponent as Logo } from '../assets/logo_custom.svg';

const Topbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${layout.topbarHeight}px;
  background-color: ${colors.text};
  z-index: 50;

  .logo {
    position: ${props => (props.isMobile ? 'unset' : 'absolute')};
    left: 60px;
    display: flex;
    align-items: center;
    font-weight: bold;

    svg {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
`;

const Navbar = styled.div`
  transform: translateX(${props => props.correction / 2}px);
  transition: transform 0.15s;
  font-size: 26px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  max-width: ${layout.appWidth}px;
  color: ${colors.textLight};
  overflow-x: scroll;

  svg,
  a {
    cursor: pointer;
    &:hover,
    &:active {
      color: ${colors.accentLight};
    }
  }
`;

const MenuItems = styled.div`
  display: flex;
  justify-content: ${props => (props.isMobile ? 'space-around' : 'flex-start')};
  width: ${props => (props.isMobile ? '100%' : 'auto')};
`;

const Actions = styled.div`
  svg {
    margin: 10px;
  }
`;

export default view(({ children }) => {
  const logo = (
    <TopLink to="/home" className="logo">
      <Logo />
      <div>Stax</div>
    </TopLink>
  );

  return (
    <Topbar isMobile={layout.isMobile}>
      {!layout.isMobile && logo}
      <Navbar correction={layout.correction}>
        <MenuItems isMobile={layout.isMobile} className="items">
          {layout.isMobile && logo}
          {children}
        </MenuItems>
        {!layout.isMobile && (
          <Actions>
            <ActionIcons />
          </Actions>
        )}
      </Navbar>
    </Topbar>
  );
});
