import React, { Component } from 'react';
import { store, view, Link, Router } from 'react-easy-stack';
import styled from 'styled-components';
import { colors } from './theme';
import { SideLink } from './Link';

const StyledSection = styled.div`
  h3 {
    cursor: pointer;
    &:hover,
    &:active {
      color: ${colors.accent};
    }
  }
`;

class SideSection extends Component {
  render() {
    const { children, name } = this.props;
    return (
      <StyledSection>
        <SideLink to={name}>{name}</SideLink>
        <Router>
          <div page={name}>{children}</div>
        </Router>
      </StyledSection>
    );
  }
}

export default view(SideSection);
