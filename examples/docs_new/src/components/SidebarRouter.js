import React from 'react';
import { Router, view } from 'react-easy-stack';
import styled from 'styled-components';
import { layout } from './theme';

const StyledRouter = styled(Router)`
  position: relative;
  overflow: hidden;
`;

const enterAnimation = elem => {
  const animation = elem.animate({ opacity: [0, 1] }, { duration: 150 });
  return new Promise(resolve => (animation.onfinish = resolve));
};

const leaveAnimation = elem => {
  Object.assign(elem.style, {
    position: 'absolute',
    top: 0,
    left: 0
  });

  const animation = elem.animate({ opacity: [1, 0] }, { duration: 150 });
  return new Promise(resolve => (animation.onfinish = resolve));
};

export default view(({ children, ...rest }) => {
  const { isMobile } = layout;

  return (
    <StyledRouter
      {...rest}
      enterAnimation={isMobile ? undefined : enterAnimation}
      leaveAnimation={isMobile ? undefined : leaveAnimation}
    >
      {children}
    </StyledRouter>
  );
});
