import React from 'react';
import { Router } from 'react-easy-stack';

const enterAnimation = {
  keyframes: {
    opacity: [0, 1]
  },
  duration: 200
};

const leaveAnimation = {
  keyframes: {
    opacity: [1, 0]
  },
  duration: 100
};

export default function NavRouter({ children, ...props }) {
  return (
    <Router
      {...props}
      enterAnimation={enterAnimation}
      leaveAnimation={leaveAnimation}
    >
      {children}
    </Router>
  );
}
