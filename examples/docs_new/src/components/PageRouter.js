import React, { Component } from 'react';
import { Router, view, store } from 'react-easy-stack';
import styled from 'styled-components';
import { ease, layout } from './theme';
import * as sidebar from './Sidebar';
import { notify } from './Notification';
import AnimatedRouter from './AnimatedRouter';

class PageRouter extends Component {
  static defaultProps = {
    nextPages: [],
    prevPages: []
  };

  onRoute = async ({ toPage }) => {
    const { pages, prevPages, nextPages } = this.props;
    const idx = pages.findIndex(page => page.name === toPage);
    const page = pages[idx];
    const prevPage = pages[idx - 1] || prevPages[prevPages.length - 1];
    const nextPage = pages[idx + 1] || nextPages[0];

    const { default: NextPage } = await import(/* webpackPrefetch: true */
    /* webpackMode: "lazy-once" */
    /* webpackChunkName: "pages" */
    `../pages${page.path}`);
    sidebar.close();
    layout.currentPage = page;

    return (
      <NextPage page={page.name} data={page} prev={prevPage} next={nextPage} />
    );
  };

  render() {
    const { pages, prevPages, nextPages, ...rest } = this.props;

    return (
      <AnimatedRouter
        {...rest}
        defaultPage={pages[0].name}
        notFoundPage="404"
        onRoute={this.onRoute}
      >
        <div page="404">Not Found Page!</div>
      </AnimatedRouter>
    );
  }
}

export default view(PageRouter);
