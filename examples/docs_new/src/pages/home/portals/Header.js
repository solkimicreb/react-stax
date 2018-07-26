import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../../../assets/logo.svg';

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  h1 {
    font-size: 40px;
    margin: 0;
    border-bottom: none;
  }

  svg {
    width: 140px;
    height: 140px;
  }
`;

export default () => (
  <Header>
    <h1>React Stax</h1>
    <Logo />
  </Header>
);
