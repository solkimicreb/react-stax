import React from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Logo } from "../../../assets/logo.svg";

const flicker = keyframes`
  0%, 80% { opacity: 1 }
  81% { opacity: 0.3 }
  82%, 89% { opacity: 1 }
  91% { opacity: 0.1 }
  91%, 98% { opacity: 1 }
  99% { opacity: 0.4 }
  100% { opacity: 1 }
`;

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

    .stack {
      animation: ${flicker} 10s linear infinite;
    }
    .stack_1 {
      animation-delay: 0.6s;
    }
    .stack_3 {
      animation-delay: 1.9s;
    }
  }
`;

export default () => (
  <Header>
    <h1>React Stax</h1>
    <Logo />
  </Header>
);
