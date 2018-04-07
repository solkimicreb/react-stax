import React from 'react';
import { view, store } from 'react-easy-stack';
import styled from 'styled-components';
import ChatIcon from 'react-icons/lib/fa/comments-o';
import { colors, layout } from './theme';
import * as sidebar from './Sidebar';
import Button from './Button';

const StyledApp = styled.main`
  position: relative;
  left: ${props => (props.withSidebar ? `${layout.sidebarWidth / 2}px` : 0)};
  max-width: ${layout.appWidth}px;
  margin: 50px auto;
`;

const ChatToggle = Button.extend`
  position: fixed;
  right: 20px;
  bottom: 20px;
`;

export default view(({ children }) => (
  <StyledApp withSidebar={sidebar.isDocked()}>
    {children}
    <ChatToggle round dark size="large" id="chat-toggle">
      <ChatIcon size={25} />
    </ChatToggle>
  </StyledApp>
));
