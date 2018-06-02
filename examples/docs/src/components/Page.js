import React, { Component, Fragment, Children } from 'react';
import { createPortal } from 'react-dom';
import { store, view } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, layout } from './theme';

const StyledPage = styled.div`
  margin: 15px;
  margin-bottom: 50px;

  pre {
    background-color: ${colors.code};
    color: ${colors.text};
    width: ${props => (props.isMobile ? '100vw' : '100%')};
    margin-left: ${props => (props.isMobile ? -15 : 0)}px;
    margin-right: ${props => (props.isMobile ? -15 : 0)}px;
    border-radius: ${props => (props.isMobile ? 0 : 3)}px;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New,
      monospace !important;
  }

  .demo {
    display: block;
    width: ${props => (props.isMobile ? '100vw' : '100%')};
    height: 400px;
    margin-left: ${props => (props.isMobile ? -15 : 0)}px;
    margin-right: ${props => (props.isMobile ? -15 : 0)}px;
    border: 1px solid ${colors.background};
    border-radius: ${props => (props.isMobile ? 0 : 3)}px;
    overflow: hidden;
    margin-bottom: 16px;
  }
`;

class Page extends Component {
  store = store({
    didMount: false
  });

  componentDidMount() {
    this.store.didMount = true;
  }

  render() {
    const { html, editURL, children, ...rest } = this.props;
    const { didMount } = this.store;

    return (
      <Fragment>
        <StyledPage
          isMobile={layout.isMobile}
          dangerouslySetInnerHTML={{ __html: html }}
          className="markdown-body"
          {...rest}
        />
        {didMount &&
          Children.map(children, child =>
            createPortal(child, document.getElementById(child.props.portal))
          )}
      </Fragment>
    );
  }
}

export default view(Page);
