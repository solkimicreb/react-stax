import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BasicLink as Link } from '../../../components/Link';
import Page from '../../../components/Page';
import Browser from '../../../components/Browser';
import NestedDemo from './portals/NestedDemo';
import RelativeDemo from './portals/RelativeDemo';
import content from './content.md';

export default () => (
  <Page html={content} {...this.props}>
    <Browser mount="nested-demo">{NestedDemo}</Browser>
    <Browser mount="relative-demo">{RelativeDemo}</Browser>
  </Page>
);
