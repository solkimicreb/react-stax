import React, { Component } from 'react';
import { Router, history } from 'react-easy-stack';
import styled from 'styled-components';
import anime from 'animejs';
import { ease, layout } from './theme';

let prevScrollX = 0;
let prevScrollY = 0;

const StyledRouter = styled(Router)`
  position: relative;
  overflow: hidden;
`;

const enterAnimation = elem => {
  const animation = elem.animate({ opacity: [0, 1] }, { duration: 2500 });
  return new Promise(resolve => (animation.onfinish = resolve));
};

const leaveAnimation = elem => {
  Object.assign(elem.style, {
    position: 'absolute',
    top: `${-window.scrollY}px`,
    left: `${-window.scrollX}px`
  });

  const animation = elem.animate({ opacity: [1, 0] }, { duration: 2500 });
  return new Promise(resolve => (animation.onfinish = resolve));
};

export default class AnimatedRouter extends Component {
  onRoute = args => {
    // issue with the prevScroll -> this is not correct!!
    // I would need the scroll position before the whole global routing start
    prevScrollX = window.scrollX;
    prevScrollY = window.scrollY;
    if (this.props.onRoute) {
      return this.props.onRoute(args);
    }
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <StyledRouter
        {...rest}
        onRoute={this.onRoute}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        {children}
      </StyledRouter>
    );
  }
}
