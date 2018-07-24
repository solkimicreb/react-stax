import React, { Component, Fragment } from 'react';
import { Link } from 'react-easy-stack';
import Page from '../../../../components/Page';
import Browser from '../../../../components/Browser';
import InterceptionDemo from './portals/InterceptionDemo';
import ProtectedDemo from './portals/ProtectedDemo';
import ParamsDemo from './portals/ParamsDemo';
import PropsDemo from './portals/PropsDemo';
import content from './content.md';

export default props => (
  <Page html={content} {...props}>
    <Link scroll={{ anchor: 'protected-pages' }} portal="redirect-link">
      Intercept, prevent or redirect
    </Link>
    <Link scroll={{ anchor: 'default-parameters' }} portal="params-link">
      Set default parameters
    </Link>
    <Link scroll={{ anchor: 'props-injection' }} portal="props-link">
      Inject props
    </Link>
    <Link portal="fetch-link">Asynchronously fetch some data</Link>
    <Link portal="lazy-link">Lazy load components</Link>
    <Link portal="virtual-link">Create virtual Routers</Link>
    <Browser mount="interception-demo">{InterceptionDemo}</Browser>
    <Browser mount="protected-demo">{ProtectedDemo}</Browser>
    <Browser mount="params-demo">{ParamsDemo}</Browser>
    <Browser mount="props-demo">{PropsDemo}</Browser>
  </Page>
);
