import React, { Component, Fragment, Children } from 'react';
import ReactDOM from 'react-dom';
import { store, view } from 'react-easy-stack';
import { BasicLink as Link } from './Link';
import styled from 'styled-components';
import BackIcon from 'react-icons/lib/fa/angle-left';
import ForwardIcon from 'react-icons/lib/fa/angle-right';
import { colors, layout } from './theme';

const StyledPage = styled.div`
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 60px;

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

const Stepper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  a {
    display: flex;
    align-items: center;
  }
  svg {
    height: 30px;
    width: 30px;
  }
`;

class Page extends Component {
  store = store({
    didMount: false
  });

  componentDidMount() {
    const { children } = this.props;
    Children.forEach(children, child => {
      if (child.props.mount) {
        ReactDOM.render(child, document.getElementById(child.props.mount));
      }
    });
    this.store.didMount = true;
  }

  render() {
    const { html, editURL, children, ...rest } = this.props;
    const { didMount } = this.store;

    return (
      <StyledPage
        isMobile={layout.isMobile}
        className="markdown-body"
        {...rest}
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {didMount &&
          Children.map(
            children,
            child =>
              child.props.portal
                ? ReactDOM.createPortal(
                    child,
                    document.getElementById(child.props.portal)
                  )
                : null
          )}
        <Stepper>
          <Link to="..">
            <BackIcon /> Prev page
          </Link>
          <Link to="..">
            Next page <ForwardIcon />
          </Link>
        </Stepper>
      </StyledPage>
    );
  }
}

export default view(Page);
