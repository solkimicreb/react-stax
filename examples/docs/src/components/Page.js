import React, { unstable_AsyncMode as AsyncMode } from "react";
import { view } from "react-easy-stack";
import styled from "styled-components";
import { colors, layout } from "./theme";

const StyledPage = styled.div`
  margin: 15px;
  margin-bottom: 50px;

  pre {
    color: ${colors.text};
    margin-left: ${props => (props.isMobile ? -20 : 0)}px;
    margin-right: ${props => (props.isMobile ? -20 : 0)}px;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New,
      monospace !important;
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
