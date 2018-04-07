import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-easy-stack';
import { colors, ease, layout } from './theme';

const NavLink = props => (
  <Link activeClass="active" {...props}>
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
  border-bottom: 5px solid rgba(0, 0, 0, 0);
  line-height: ${layout.topbarHeight}px;

  &:hover:not(.active),
  &:active:not(.active) {
    color: ${colors.accentLight};
  }

  &.active {
    border-color: ${colors.accent};
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
