import React, { Fragment } from 'react';
import { view, store, path } from 'react-easy-stack';
import styled from 'styled-components';
import ChatIcon from 'react-icons/lib/fa/comments-o';
import { colors, layout } from './theme';
import * as sidebar from './Sidebar';
import Button from './Button';

const StyledApp = styled.main`
  transform: ${props =>
    props.withSidebar ? `translateX(${layout.sidebarWidth / 2}px)` : 'none'};
  max-width: ${layout.appWidth}px;
  margin: ${layout.topbarHeight + 15}px auto;
  transition: transform 0.2s;
`;

const ChatToggle = Button.extend`
  position: fixed;
  right: 10px;
  bottom: 10px;
`;

export default view(({ children }) => (
  <Fragment>
    <StyledApp withSidebar={path[0] === 'docs' && sidebar.isDocked()}>
      {children}
    </StyledApp>
    <ChatToggle round dark size="large" id="chat-toggle">
      <ChatIcon size={25} />
    </ChatToggle>
  </Fragment>
));
