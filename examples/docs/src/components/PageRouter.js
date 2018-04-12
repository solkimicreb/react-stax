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
  }
`;

function getAnimations() {
  return {
    enterAnimation: {
      keyframes: {
        opacity: [0, 1]
      },
      duration: 150,
      ease: ease.in
    },
    leaveAnimation: {
      keyframes: {
        opacity: [1, 0]
      },
      duration: 150,
      ease: ease.out
    }
  };
}

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
    const { enterAnimation, leaveAnimation } = getAnimations();

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
