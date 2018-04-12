import React from 'react';
import { view } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, layout } from './theme';

const StyledPage = styled.div`
  margin: 10px;
  margin-bottom: 50px;

  pre {
    font-size: 15px;
    line-height: 1.4;
    color: ${colors.text};
    margin-left: ${props => (props.isMobile ? -18 : 0)}px;
    margin-right: ${props => (props.isMobile ? -18 : 0)}px;
  }
`;

export default view(({ html, editURL, children, ...props }) => (
  <StyledPage
    isMobile={layout.isMobile}
    dangerouslySetInnerHTML={{ __html: html }}
    className="markdown-body"
    {...props}
  />
));
