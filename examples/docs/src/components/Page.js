import React from 'react';
import styled from 'styled-components';

const StyledPage = styled.div`
  padding: 10px;
`;

export default ({ html, children, ...props }) =>
  html ? (
    <StyledPage
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
      className="markdown-body"
    />
  ) : (
    <StyledPage {...props}>{children}</StyledPage>
  );
