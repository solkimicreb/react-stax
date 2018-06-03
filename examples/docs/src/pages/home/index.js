import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-easy-stack';
import Page from '../../components/Page';
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
  </Page>
);
