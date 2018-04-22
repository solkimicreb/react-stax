import React, { Component } from 'react';
import { Router, view } from 'react-easy-stack';
import styled from 'styled-components';
import { ease, layout } from './theme';
import * as sidebar from './Sidebar';
import { notify } from './Notification';

const StyledRouter = styled(Router)`
  position: relative;

  > * {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    will-change: auto;
    contain: style layout;
  }
`;

const enterAnimation = () => ({
  keyframes: layout.isMobile
    ? {
        transform: ['translateX(110%)', 'none']
      }
    : {
        opacity: [0, 1]
      },
  duration: 200,
  ease: ease.in,
  fill: 'both'
});

const leaveAnimation = () => {
  const scrollY = document.getElementById('root').scrollTop;

  return {
    keyframes: layout.isMobile
      ? {
          transform: [
            `translateY(-${scrollY}px)`,
            `translate3d(-110%, -${scrollY}px, 0)`
          ]
        }
      : {
          opacity: [1, 0],
          transform: [`translateY(-${scrollY}px)`, `translateY(-${scrollY}px)`]
        },
    duration: 200,
    ease: ease.out,
    fill: 'both'
  };
};

class PageRouter extends Component {
  onRoute = async ev => {
    sidebar.close();
    if (this.props.onRoute) {
      try {
        return await this.props.onRoute(ev);
      } catch (err) {}
    }
  };

  render() {
    const { children, ...props } = this.props;

    return (
      <StyledRouter
        {...props}
        notFoundPage="404"
        onRoute={this.onRoute}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        {children}
        <div page="404">Not Found Page!</div>
      </StyledRouter>
    );
  }
}

export default view(PageRouter);
