import React, { Component } from 'react';
import { Router, history } from 'react-easy-stack';
import styled from 'styled-components';
import anime from 'animejs';
import { ease, layout } from './theme';

const StyledRouter = styled(Router)`
  overflow: hidden;
`;

const enterAnimation = elem => {
  const animation = elem.animate({ opacity: [0, 1] }, { duration: 200 });
  return new Promise(resolve => (animation.onfinish = resolve));
};

const leaveAnimation = elem => {
  const { left, width, height } = elem.getBoundingClientRect();
  const top = -window.scrollY;

  Object.assign(elem.style, {
    position: 'fixed',
    top: `${top + 50}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  });

  const animation = elem.animate({ opacity: [1, 0] }, { duration: 200 });
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
