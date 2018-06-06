import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BasicLink as Link } from '../../components/Link';
import Page from '../../components/Page';
import Browser from '../../components/Browser';
import RoutingDemo from './portals/RoutingDemo';
import StateDemo from './portals/StateDemo';
import IntegrationsDemo from './portals/IntegrationsDemo';
import FinalDemo from './portals/FinalDemo';
import content from './content.md';

export default () => (
  <Page html={content} {...this.props}>
    <Link to="/docs/routing" portal="routing-link">
      routing docs
    </Link>
    <Link to="/docs/state" portal="state-link">
      state management docs
    </Link>
    <Link to="/docs/integrations" portal="integrations-link">
      integrations docs
    </Link>
    <Browser mount="routing-demo">{RoutingDemo}</Browser>
    <Browser mount="state-demo">{StateDemo}</Browser>
    <Browser mount="integrations-demo">{IntegrationsDemo}</Browser>
    <Browser mount="final-demo">{FinalDemo}</Browser>
  </Page>
);
