import React from 'react';
import { Router } from 'react-easy-stack';
import styled from 'styled-components';
import { layout } from './theme';

const StyledRouter = styled(Router)`
  position: relative;
  overflow: hidden;
`;

const enterAnimation = elem => {
  const animation = elem.animate(
    layout.isMobile
      ? {
          transform: ['translateX(-100%)', 'none']
        }
      : { opacity: [0, 1] },
    { duration: layout.isMobile ? 240 : 150 }
  );
  return new Promise(resolve => (animation.onfinish = resolve));
};

const leaveAnimation = elem => {
  Object.assign(elem.style, {
    position: 'absolute',
    top: `${-window.scrollY}px`,
    left: `${-window.scrollX}px`
  });

  const animation = elem.animate(
    layout.isMobile
      ? {
          transform: ['none', 'translateX(100%)']
        }
      : { opacity: [1, 0] },
    { duration: layout.isMobile ? 240 : 150 }
  );
  return new Promise(resolve => (animation.onfinish = resolve));
};

export default ({ children, ...rest }) => (
  <StyledRouter
    {...rest}
    enterAnimation={enterAnimation}
    leaveAnimation={leaveAnimation}
  >
    {children}
  </StyledRouter>
);
