import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-easy-stack';
import { colors, ease, layout } from './theme';

const NavLink = props => (
  <Link
    activeClass="active"
    options={{
      scroll: {
        top: 0,
        left: 0,
        container: '#root'
      },
      ...props.options
    }}
    {...props}
  >
    {props.children}
  </Link>
);

export const TopLink = styled(NavLink)`
  cursor: pointer;
  text-decoration: none !important;
  font-size: 18px;
  padding: 0 15px;
  color: ${colors.textLight};
  transition: color 0.2s ${ease.both}, border-color 0.4s ${ease.both};
  line-height: ${layout.topbarHeight}px;

  &:hover,
  &:active,
  &.active {
    color: ${colors.accentLight};
  }
`;

export const SideLink = styled(NavLink)`
  cursor: pointer;
  text-decoration: none !important;
  font-size: 18px;
  display: block;
  color: ${colors.text};
  transition: color 0.2s ${ease.both}, border-color 0.4s ${ease.both};
  padding: 2px 10px;
  margin: 10px 2px;
  border-left: 5px solid rgba(0, 0, 0, 0);

  &:hover:not(.active),
  &:active:not(.active) {
    color: ${colors.accent};
  }

  &.active {
    border-color: ${colors.accent};
  }
`;

export const SideSectionLink = styled(NavLink)`
  cursor: pointer;
  text-decoration: none !important;
  font-size: 18px;
  display: block;
  color: ${colors.text};
  transition: color 0.2s ${ease.both};
  padding: 2px 0;
  margin: 10px 2px;

  &:hover:not(.active),
  &:active:not(.active),
  &.active {
    color: ${colors.accent};
  }
`;
