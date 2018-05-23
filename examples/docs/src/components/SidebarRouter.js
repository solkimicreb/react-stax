import React from 'react';
import { Router, view } from 'react-easy-stack';
import { ease } from './theme';

const enterAnimation = {
  keyframes: {
    transform: ['translateX(400px)', 'none']
  },
  duration: 2000
};

const leaveAnimation = {
  keyframes: {
    transform: ['none', 'translateX(-400px)']
  },
  duration: 2000
};

export default ({ children }) => (
  <Router enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
    {children}
  </Router>
);
