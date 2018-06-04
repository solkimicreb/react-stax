import React, { Component } from 'react';
import { view, store, path, params } from 'react-easy-stack';
import styled from 'styled-components';
import Frame from 'react-frame-component';
import GithubIcon from 'react-icons/lib/fa/github';
import LinkIcon from 'react-icons/lib/fa/external-link';
import BackIcon from 'react-icons/lib/fa/angle-left';
import ForwardIcon from 'react-icons/lib/fa/angle-right';
import RefreshIcon from 'react-icons/lib/fa/refresh';
import { colors, ease, layout } from './theme';

const BrowserFrame = styled.div`
  width: ${props => (props.isMobile ? '100vw' : '100%')};
  height: 300px;
  margin-left: ${props => (props.isMobile ? -15 : 0)}px;
  margin-right: ${props => (props.isMobile ? -15 : 0)}px;
  border-radius: ${props => (props.isMobile ? 0 : 3)}px;
  box-shadow: 1px 1px 4px 1px ${colors.textLight};
`;

const BrowserBar = styled.nav`
  top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 10px;
  background-color: ${colors.code};
  color: ${colors.text};
  border-bottom: 1px solid ${colors.textLight};

  svg {
    width: 30px;
    height: 30px;
    padding: 3px;
    margin: 3px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
      background-color: ${colors.textLight};
    }
  }
`;

const AddressBar = styled.input`
  height: 30px;
  font-size: 16px;
  margin-left: 15px !important;
  padding: 10px;
  max-width: calc(100vw - 120px);
  width: 400px;
  border: 1px solid ${colors.textLight};
  border-radius: 3px;
`;

const IFrame = styled.iframe`
  width: 100%;
  height: calc(100% - 40px);
  overflow: scroll;
  border: none;
`;

// it should load a private easy-stack/node version and inject it to children
class Browser extends Component {
  render() {
    const { children } = this.props;
    return (
      <BrowserFrame isMobile={layout.isMobile}>
        <BrowserBar>
          <BackIcon onClick={this.onHistoryBack} />
          <ForwardIcon onClick={this.onHistoryForward} />
          <RefreshIcon />
          <AddressBar value="example.com" />
        </BrowserBar>
        <div>{children}</div>
      </BrowserFrame>
    );
  }
}

export default view(Browser);
