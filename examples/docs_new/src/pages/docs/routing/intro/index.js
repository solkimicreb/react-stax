import React, { Component, Fragment } from 'react';
import { Link } from 'react-easy-stack';
import ReactDOM from 'react-dom';
import Page from '../../../../components/Page';
import Browser from '../../../../components/Browser';
import LinksDemo from './portals/LinksDemo';
import content from './content.md';

export default props => (
  <Page html={content} {...props}>
    <Link to="../params" portal="params-link">
      dynamic routing parameters
    </Link>
    <Link to="../async" portal="async-link">
      async routing
    </Link>
    <Link to="../api" portal="api-link">
      routing API
    </Link>
    <Browser mount="links-demo">{LinksDemo}</Browser>
  </Page>
);