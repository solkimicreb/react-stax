import React, { Component, Fragment } from 'react';
import { Link } from 'react-stax';
import Page from '../../../../components/Page';
import Browser from '../../../../components/Browser';
import InterceptionDemo from './portals/InterceptionDemo';
import ProtectedDemo from './portals/ProtectedDemo';
import ParamsDemo from './portals/ParamsDemo';
import PropsDemo from './portals/PropsDemo';
import content from './content.md';

export default props => (
  <Page html={content} {...props}>
    <Link scroll={{ anchor: 'protected-pages' }} portal="redirect-link" />
    <Link scroll={{ anchor: 'default-parameters' }} portal="params-link" />
    <Link scroll={{ anchor: 'props-injection' }} portal="props-link" />
    <Link portal="fetch-link" />
    <Link portal="lazy-link" />
    <Link portal="virtual-link" />
    <Browser mount="interception-demo">{InterceptionDemo}</Browser>
    <Browser mount="protected-demo">{ProtectedDemo}</Browser>
    <Browser mount="params-demo">{ParamsDemo}</Browser>
    <Browser mount="props-demo">{PropsDemo}</Browser>
  </Page>
);
