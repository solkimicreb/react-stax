import React from 'react';
import { Router } from 'react-easy-stack';
import { ease } from './theme';

const enterAnimation = {
  keyframes: {
    opacity: [0, 1]
    // transform: ['translateX(-100%)', 'none']
  },
  duration: 1500,
  ease: ease.in
};

const leaveAnimation = {
  keyframes: {
    opacity: [1, 0]
    // transform: ['none', 'translateX(-100%)']
  },
  duration: 1500,
  ease: ease.out
};

export default ({ page, children, isDefault, ...props }) => (
  <Router
    {...props}
    defaultPage={isDefault ? page : undefined}
    enterAnimation={enterAnimation}
    leaveAnimation={leaveAnimation}
  >
    <div page={page}>{children}</div>
  </Router>
);
