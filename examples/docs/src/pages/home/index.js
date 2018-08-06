import React, { Component, Fragment } from 'react'
import { Link } from 'react-easy-stack'
import Page from '../../components/Page'
import Browser from '../../components/Browser'
import RoutingDemo from './portals/RoutingDemo'
import StateDemo from './portals/StateDemo'
import IntegrationsDemo from './portals/IntegrationsDemo'
import FinalDemo from './portals/FinalDemo'
import Header from './portals/Header'
import content from './content.md'

export default props => (
  <Page html={content} {...props}>
    <Link to="/docs/routing" portal="routing-link">
      routing docs
    </Link>
    <Link to="/docs/state" portal="state-link">
      state management docs
    </Link>
    <Link to="/docs/integrations" portal="integrations-link">
      integrations docs
    </Link>
    <Link to="/docs" portal="docs-link">
      docs
    </Link>
    <Link to="/examples" portal="examples-link">
      examples page
    </Link>
    <Header mount="header" />
    <Browser mount="routing-demo">{RoutingDemo}</Browser>
    <Browser mount="state-demo">{StateDemo}</Browser>
    <Browser mount="integrations-demo">{IntegrationsDemo}</Browser>
    <Browser mount="final-demo">{FinalDemo}</Browser>
  </Page>
)
