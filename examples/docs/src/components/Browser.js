import React, { Component } from 'react';
import { view, store, history } from 'react-easy-stack';
import easyStackFactory from 'react-easy-stack/dist/sandbox.es.es6';
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

const BASE_URL = 'example.com';

class Browser extends Component {
  store = store({ url: BASE_URL, Content: () => null });

  async componentDidMount() {
    this.easyStack = easyStackFactory();
    const { history } = this.easyStack;

    const originalPush = history.push;
    const originalReplace = history.replace;
    Object.assign(history, {
      push: item => {
        item = Reflect.apply(originalPush, history, [item]);
        this.store.url = BASE_URL + item.url;
      },
      replace: item => {
        item = Reflect.apply(originalReplace, history, [item]);
        this.store.url = BASE_URL + item.url;
      }
    });

    this.store.Content = this.props.children(this.easyStack);
    this.forceUpdate();
  }

  onHistoryBack = () => this.easyStack.history.back();
  onHistoryForward = () => this.easyStack.history.forward();
  onRefresh = () => {
    this.store.Content = this.props.children(this.easyStack);
    this.forceUpdate();
  };

  render() {
    const { Content, url } = this.store;

    return (
      <BrowserFrame isMobile={layout.isMobile}>
        <BrowserBar>
          <BackIcon onClick={this.onHistoryBack} />
          <ForwardIcon onClick={this.onHistoryForward} />
          <RefreshIcon onClick={this.onRefresh} />
          <AddressBar value={url} />
        </BrowserBar>
        <Content />
      </BrowserFrame>
    );
  }
}

export default view(Browser);
