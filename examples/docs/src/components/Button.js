import React from 'react';
import styled from 'styled-components';
import { colors, ease } from './theme';

function getSize(size) {
  switch (size) {
    case 'small':
      return '20px';
    case 'large':
      return '50px';
    default:
      return '40px';
  }
}

export default styled.button`
  color: ${props => (props.dark ? colors.textLight : colors.text)};
  background-color: ${props =>
    props.dark ? colors.background : colors.backgroundLight};
  width: ${props => getSize(props.size)};
  height: ${props => getSize(props.size)};
  border-radius: ${props => (props.round ? getSize(props.size) : '3px')};
  cursor: pointer;
  transition: color 0.2s ${ease.both};

  &:hover,
  &:active {
    color: ${props => (props.dark ? colors.accentLight : colors.accent)};
  }
`;
