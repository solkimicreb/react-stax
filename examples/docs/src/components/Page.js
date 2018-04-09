import React from 'react';
import styled from 'styled-components';
import { colors } from './theme';

const StyledPage = styled.div`
  margin: 10px;
  margin-bottom: 50px;
`;

const EditNotice = styled.a`
  display: block;
  margin-top: 30px;
  color: ${colors.textLight};
`;

export default ({ html, editURL, children, ...props }) => (
  <StyledPage>
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="markdown-body"
      {...props}
    />

    <EditNotice href={editURL}>Edit this page</EditNotice>
  </StyledPage>
);
