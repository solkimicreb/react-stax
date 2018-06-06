import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BasicLink as Link } from '../../../components/Link';
import Page from '../../../components/Page';
import Browser from '../../../components/Browser';
import BasicDemo from './portals/BasicDemo';
import GlobalDemo from './portals/GlobalDemo';
import LocalDemo from './portals/LocalDemo';
import content from './content.md';

export default () => (
  <Page html={content} {...this.props}>
    <Browser mount="basic-demo">{BasicDemo}</Browser>
    <Browser mount="global-demo">{GlobalDemo}</Browser>
    <Browser mount="local-demo">{LocalDemo}</Browser>
  </Page>
);
