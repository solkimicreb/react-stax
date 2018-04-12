import React, { Fragment } from 'react';
import Switch from './Switch';
import { SideSectionLink } from './Link';

export default ({ children, page, name }) => (
  <Fragment>
    <SideSectionLink to={page}>{name}</SideSectionLink>
    <Switch page={page}>{children}</Switch>
  </Fragment>
);
