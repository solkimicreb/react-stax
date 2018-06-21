import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BasicLink as Link } from '../../../../components/Link';
import Page from '../../../../components/Page';
import Browser from '../../../../components/Browser';
import LoaderDemo from './portals/LoaderDemo';
import content from './content.md';

export default props => <Page html={content} {...props} />;
