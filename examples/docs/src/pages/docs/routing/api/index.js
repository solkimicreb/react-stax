import React from 'react';
import { Link } from 'react-stax';
import Page from '../../../../components/Page';
import content from './content.md';

export default props => <Page html={content} {...props} />;
