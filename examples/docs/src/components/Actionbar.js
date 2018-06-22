import React from 'react';
import styled, { keyframes } from 'styled-components';
import ActionIcons from './ActionIcons';
import { colors, layout, ease } from './theme';

const Actionbar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 26px;
  border-top: 1px solid ${colors.textLight};
  height: ${layout.actionbarHeight}px;
  color: ${colors.text};
  background-color: ${colors.backgroundLight};
  z-index: 50;
  transition: color 0.2s;

  > * {
    cursor: pointer;
    &:hover,
    &:active {
      color: ${colors.accent};
    }
  }
`;

export default () => (
  <Actionbar>
    <ActionIcons />
  </Actionbar>
);
