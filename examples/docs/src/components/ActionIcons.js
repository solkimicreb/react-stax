import React, { Fragment } from 'react';
import { view } from 'react-stax';
import styled from 'styled-components';
import GithubIcon from 'react-icons/lib/fa/github';
import ChatIcon from 'react-icons/lib/fa/comments-o';
import MenuIcon from 'react-icons/lib/fa/bars';
import EditIcon from 'react-icons/lib/fa/edit';
import { colors, layout, ease } from './theme';
import * as sidebar from './Sidebar';
import * as chat from './Chat';

const CorrectedEditIcon = styled(EditIcon)`
  position: relative;
  top: 2px;
`;

export default view(() => (
  <Fragment>
    <a href="https://github.com/solkimicreb/react-stax">
      <GithubIcon />
    </a>
    <a href={layout.currentPage.edit}>
      <CorrectedEditIcon />
    </a>
    {!layout.isLarge &&
      layout.currentPage.chat !== false && (
        <span onClick={chat.toggle}>
          <ChatIcon />
        </span>
      )}
    {layout.isMobile &&
      layout.currentPage.sidebar !== false && (
        <span onClick={sidebar.toggle}>
          <MenuIcon />
        </span>
      )}
  </Fragment>
));
