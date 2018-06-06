import React, { Component } from 'react';
import { view, store, history } from 'react-easy-stack';
import easyStackFactory from 'react-easy-stack/dist/sandbox.es.es6';
import styled, { keyframes } from 'styled-components';
import Frame from 'react-frame-component';
import GithubIcon from 'react-icons/lib/fa/github';
import LinkIcon from 'react-icons/lib/fa/external-link';
import BackIcon from 'react-icons/lib/fa/angle-left';
import ForwardIcon from 'react-icons/lib/fa/angle-right';
import RefreshIcon from 'react-icons/lib/fa/refresh';
import { colors, ease, layout } from './theme';

const BrowserFrame = styled.div`
  position: relative;
  width: ${props => (props.isMobile ? '100vw' : '100%')};
  min-height: ${props => Math.min(300, Math.max(props.height, 150))}px;
  max-height: 300px;
  margin: 15px ${props => (props.isMobile ? -15 : 0)}px;
  border-radius: ${props => (props.isMobile ? 0 : 3)}px;
  box-shadow: 1px 1px 4px 1px ${colors.textLight};
  overflow: hidden;
`;

const BrowserBar = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 10px;
  background-color: ${colors.code};
  color: ${colors.text};
  border-bottom: 1px solid ${colors.textLight};
`;

const IconButton = styled.button`
  width: 30px;
  height: 30px;
  padding: 3px;
  border: none;
  background-color: inherit;
  border-radius: 3px;
  outline: none;
  transition: background-color 0.2s;

  svg {
    width: ${props => (props.small ? 75 : 100)}%;
    height: ${props => (props.small ? 75 : 100)}%;
  }
  &:hover {
    background-color: ${props =>
      props.disabled ? 'inherit' : colors.textLight};
  }
`;

const AddressBar = styled.input`
  height: 30px;
  font-size: 16px;
  margin-left: 15px !important;
  padding: 10px;
  max-width: calc(100vw - 130px);
  width: 500px;
  border: 1px solid ${colors.textLight};
  border-radius: 3px;
`;

const Body = styled.div`
  max-height: 260px;
  margin-top: 40px;
  padding: 10px;
  overflow: scroll;

  * {
    font: inherit;
    background-color: inherit;
    color: inherit;
  }
  a,
  button,
  input {
    margin-right: 10px;
  }
  button,
  input {
    padding: 0 8px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid ${colors.textLight};
    outline: none;
  }
  button {
    cursor: pointer;
  }
  ul {
    margin-top: 10px;
  }
`;

const slide = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(150%);
  }
`;

const Loader = styled.div`
  position: absolute;
  top: 39px;
  left: 0;
  width: 70%;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    ${colors.text},
    ${colors.text},
    rgba(0, 0, 0, 0)
  );
  animation: ${slide} 0.8s linear infinite;
`;

const BASE_URL = 'example.com';

class Browser extends Component {
  constructor(props) {
    super(props);

    this.height = 0;
    this.browser = React.createRef();
    this.easyStack = easyStackFactory();
    this.instrumentFetch();
    this.instrumentHistory();
    this.store = store({
      url: '',
      Content: props.children(this.easyStack),
      isLoading: false
    });
  }

  instrumentFetch = () => {
    this.easyStack.fetch = url => {
      this.store.isLoading = true;
      return window
        .fetch(url)
        .then(resp => {
          this.store.isLoading = false;
          return resp;
        })
        .catch(err => {
          this.store.isLoading = false;
          throw err;
        });
    };
  };

  instrumentHistory = () => {
    const { history } = this.easyStack;

    const originalPush = history.push;
    const originalReplace = history.replace;
    Object.assign(history, {
      push: item => {
        item = Reflect.apply(originalPush, history, [item]);
        this.store.url = decodeURI(item.url);
        return item;
      },
      replace: item => {
        item = Reflect.apply(originalReplace, history, [item]);
        this.store.url = decodeURI(item.url);
        return item;
      }
    });
  };

  onHistoryBack = () => this.easyStack.history.back();
  onHistoryForward = () => this.easyStack.history.forward();
  onRefresh = () => {
    this.height = this.browser.current.offsetHeight;
    this.store.Content = this.props.children(this.easyStack);
  };
  onUrlChange = ev => {
    let url = ev.target.value;
    const baseUrlIndex = url.indexOf(BASE_URL);
    if (baseUrlIndex === 0) {
      url = url.slice(BASE_URL.length);
    }
    this.store.url = url;
  };
  onUrlReload = ev => {
    if (ev.key === 'Enter') {
      // push a new state and refresh (reload page)
      this.easyStack.history.push(this.store.url);
      this.onRefresh();
    }
  };

  render() {
    const { Content, url, isLoading } = this.store;
    const { history } = this.easyStack;

    const canGoBack = 0 < history.idx;
    const canGoForward = history.idx < history.items.length - 1;
    const fullUrl = layout.isMobile ? url : BASE_URL + url;

    return (
      <BrowserFrame
        isMobile={layout.isMobile}
        innerRef={this.browser}
        height={this.height}
      >
        <BrowserBar>
          <IconButton disabled={!canGoBack} onClick={this.onHistoryBack}>
            <BackIcon />
          </IconButton>
          <IconButton disabled={!canGoForward} onClick={this.onHistoryForward}>
            <ForwardIcon />
          </IconButton>
          <IconButton small>
            <RefreshIcon onClick={this.onRefresh} />
          </IconButton>
          <AddressBar
            value={fullUrl}
            placeholder={BASE_URL}
            onChange={this.onUrlChange}
            onKeyPress={this.onUrlReload}
          />
        </BrowserBar>
        {isLoading && <Loader />}
        <Body>
          <Content />
        </Body>
      </BrowserFrame>
    );
  }
}

export default view(Browser);
