import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import Page from '../../../components/Page'
import SupportTable from './portals/SupportTable'

import content from './content.md'

export default props => (
  <Page html={content} {...props}>
    <SupportTable mount='support-table' />
  </Page>
)
