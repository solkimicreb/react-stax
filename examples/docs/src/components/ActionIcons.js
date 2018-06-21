import React, { Fragment } from 'react';
import { view } from 'react-easy-stack';
import styled from 'styled-components';
import GithubIcon from 'react-icons/lib/fa/github';
import ChatIcon from 'react-icons/lib/fa/comments-o';
import MenuIcon from 'react-icons/lib/fa/bars';
import EditIcon from 'react-icons/lib/fa/edit';
import { colors, layout, ease } from './theme';
import * as sidebar from './Sidebar';
import { pages } from './PageRouter';

const CorrectedEditIcon = styled(EditIcon)`
  position: relative;
  top: 2px;
`;

export default view(() => (
  <Fragment>
    <a href="https://github.com/solkimicreb/react-easy-stack">
      <GithubIcon />
    </a>
    <a href={pages.current.edit}>
      <CorrectedEditIcon />
    </a>
    <span id="chat-toggle">
      <ChatIcon />
    </span>
    {sidebar.hasSidebar() &&
      layout.isMobile && (
        <span onClick={sidebar.toggle}>
          <MenuIcon />
        </span>
      )}
  </Fragment>
));
