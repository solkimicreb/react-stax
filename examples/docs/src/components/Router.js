import React from 'react';
import { Router, view } from 'react-easy-stack';
import styled from 'styled-components';
import { ease } from './theme';
import * as sidebar from './Sidebar';

const StyledRouter = styled(Router)`
  position: relative;
  > * {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
`;

export default view(({ children, ...props }) => {
  const enterAnimation = {
    keyframes: {
      opacity: [0, 1]
    },
    delay: sidebar.isDocked() ? 0 : 140,
    duration: 150,
    ease: ease.in
  };

  const leaveAnimation = {
    keyframes: {
      opacity: [1, 0]
    },
    delay: sidebar.isDocked() ? 0 : 140,
    duration: 125,
    ease: ease.out
  };

  return (
    <StyledRouter
      {...props}
      enterAnimation={enterAnimation}
      leaveAnimation={leaveAnimation}
    >
      {children}
    </StyledRouter>
  );
});
