import React from 'react';
import { Router } from 'react-easy-stack';
import styled from 'styled-components';
import { ease } from './theme';

const enterAnimation = {
  keyframes: {
    opacity: [0, 1]
  },
  duration: 200,
  ease: ease.in
};

const leaveAnimation = {
  keyframes: {
    opacity: [1, 0]
  },
  duration: 200,
  ease: ease.out
};

const StyledRouter = styled(Router)`
  position: relative;
  > * {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
`;

export default ({ children, ...props }) => (
  <StyledRouter
    {...props}
    enterAnimation={enterAnimation}
    leaveAnimation={leaveAnimation}
  >
    {children}
  </StyledRouter>
);
