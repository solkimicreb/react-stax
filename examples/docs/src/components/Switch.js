import React from "react";
import { Router } from "react-easy-stack";
import { ease, layout } from "./theme";

const enterAnimation = {
  keyframes: {
    opacity: [0, 1]
    // transform: [`translateX(${-layout.sidebarWidth}px)`, 'none']
  },
  duration: 150,
  ease: ease.in
};

const leaveAnimation = {
  keyframes: {
    opacity: [1, 0]
    // transform: ['none', `translateX(${-layout.sidebarWidth}px)`]
  },
  duration: 150,
  ease: ease.out
};

export default ({ page, children, isDefault, ...props }) => (
  <Router
    {...props}
    enterAnimation={enterAnimation}
    leaveAnimation={leaveAnimation}
  >
    <div page={page}>{children}</div>
  </Router>
);
