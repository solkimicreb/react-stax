import React from 'react';
import { view } from 'react-easy-stack';
import styled from 'styled-components';
import GithubIcon from 'react-icons/lib/fa/github';
import { colors, layout } from './theme';
import { Toggle as SidebarToggle } from './Sidebar';

const StyledTopbar = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: ${layout.topbarHeight}px;
  background-color: ${colors.text};
  color: ${colors.textLight};
  z-index: 100;
`;

const StyledNavbar = styled.div`
  max-width: ${layout.appWidth}px;
  margin: auto;
`;

const StyledIcon = styled.span`
  cursor: pointer;
  font-size: 30px;
  color: ${colors.textLight};
  float: right;
  margin-right: 15px;
`;

// float right and left (the icons)
export default view(({ children }) => (
  <StyledTopbar>
    <SidebarToggle />
    <StyledIcon>
      <GithubIcon />
    </StyledIcon>
    <StyledNavbar>{children}</StyledNavbar>
  </StyledTopbar>
));
