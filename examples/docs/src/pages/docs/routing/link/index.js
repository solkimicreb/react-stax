import React, { Component, Fragment } from 'react';
import { Link } from 'react-stax';
import Page from '../../../../components/Page';
import Browser from '../../../../components/Browser';
import BasicDemo from './portals/BasicDemo';
import GlobalDemo from './portals/GlobalDemo';
import LocalDemo from './portals/LocalDemo';
import content from './content.md';

export default props => (
  <Page html={content} {...props}>
    <Browser mount="basic-demo">{BasicDemo}</Browser>
    <Browser mount="global-demo">{GlobalDemo}</Browser>
    <Browser mount="local-demo">{LocalDemo}</Browser>
  </Page>
);
