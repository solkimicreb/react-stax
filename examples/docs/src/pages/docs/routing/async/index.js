import React, { Component, Fragment } from 'react';
import { Link } from 'react-stax';
import Page from '../../../../components/Page';
import Browser from '../../../../components/Browser';
import StartingParamsDemo from './portals/StartingParamsDemo';
import ParamsDemo from './portals/ParamsDemo';
import content from './content.md';

export default props => (
  <Page html={content} {...props}>
    <Link to="../integrations" />
    <Browser mount="starting-params-demo">{StartingParamsDemo}</Browser>
    <Browser mount="params-demo">{ParamsDemo}</Browser>
  </Page>
);
