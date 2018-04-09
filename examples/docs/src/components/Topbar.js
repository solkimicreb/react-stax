import React from 'react';
import { view } from 'react-easy-stack';
import styled from 'styled-components';
import GithubIcon from 'react-icons/lib/fa/github';
import { colors, layout, ease } from './theme';
import { Toggle as SidebarToggle } from './Sidebar';
import Icon from './Icon';

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
  padding-left: 45px;
`;

const LeftIcon = Icon.extend`
  float: left;
  position: relative;
  left: 15px;
  top: 10px;
`;

const RightIcon = Icon.extend`
  float: right;
  position: relative;
  right: 15px;
  top: 4px;
`;

export default view(({ children }) => (
  <StyledTopbar>
    <LeftIcon size={20}>
      <SidebarToggle />
    </LeftIcon>
    <RightIcon>
      <GithubIcon />
    </RightIcon>
    <StyledNavbar>{children}</StyledNavbar>
  </StyledTopbar>
));
