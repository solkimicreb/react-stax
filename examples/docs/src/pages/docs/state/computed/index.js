import React, { Component, Fragment } from 'react';
import { Link } from 'react-easy-stack';
import Page from '../../../../components/Page';
import Browser from '../../../../components/Browser';
import GetterDemo from './portals/GetterDemo';
import content from './content.md';

export default props => (
  <Page html={content} {...props}>
    <Link
      to="../mutations"
      scroll={{ anchor: 'mutating-inside-store-methods' }}
      portal="store-ref-link"
    />
    <Link
      to="../mutations"
      scroll={{ anchor: 'keeping-the-store-pure' }}
      portal="mutators-link"
    />
    <Browser mount="getter-demo">{GetterDemo}</Browser>
  </Page>
);
