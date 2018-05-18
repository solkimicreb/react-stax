import React, { Fragment } from "react";
import { view, store, path } from "react-easy-stack";
import styled from "styled-components";
import { colors, layout } from "./theme";
import * as sidebar from "./Sidebar";
import Button from "./Button";

const StyledApp = styled.main`
  box-sizing: content-box;
  max-width: ${layout.appWidth}px;
  margin: ${layout.topbarHeight + 15}px auto;
  padding-left: ${props => (props.withSidebar ? 250 : 0)}px;
`;

export default view(({ children }) => (
  <StyledApp withSidebar={sidebar.hasSidebar() && !layout.isMobile}>
    {children}
  </StyledApp>
));
