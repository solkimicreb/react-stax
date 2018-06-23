import React from 'react';
import { Router } from 'react-easy-stack';
import styled from 'styled-components';
import { ease, layout } from './theme';

const StyledRouter = styled(Router)`
  position: relative;
  overflow-x: hidden;

  > * {
    will-change: auto;
    contain: style layout;

    top: 0;
    left: 0;
    right: 0;
  }
`;

const enterAnimation = () => ({
  keyframes: layout.isMobile
    ? {
        transform: ['translateX(100vw)', 'none']
      }
    : {
        opacity: [0, 1]
      },
  duration: 1500,
  ease: ease.in
});

const leaveAnimation = () => {
  const scrollY = window.scrollY;

  return {
    keyframes: layout.isMobile
      ? {
          transform: [
            `translateY(-${scrollY}px)`,
            `translate3d(-100vw, -${scrollY}px, 0)`
          ],
          position: ['absolute', 'absolute']
        }
      : {
          opacity: [1, 0],
          transform: [`translateY(-${scrollY}px)`, `translateY(-${scrollY}px)`],
          position: ['absolute', 'absolute']
        },
    duration: 1500,
    ease: ease.out
  };
};

export default function AnimatedRouter({ children, ...rest }) {
  return (
    <StyledRouter
      {...rest}
      enterAnimation={enterAnimation}
      leaveAnimation={leaveAnimation}
    >
      {children}
    </StyledRouter>
  );
}
