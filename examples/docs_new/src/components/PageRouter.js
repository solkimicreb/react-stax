import React, { Component } from 'react';
import { Router, view } from 'react-easy-stack';
import anime from 'animejs';
import { ease, layout } from './theme';
import * as sidebar from './Sidebar';
import { notify } from './Notification';
import ContentRouter from './ContentRouter';

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

    const { default: NextPage } = await import(/* webpackMode: "lazy-once" */
    /* webpackChunkName: "pages" */
    `../pages${page.path}`);

    layout.currentPage = page;
    sidebar.close();

    return (
      <NextPage page={page.name} data={page} prev={prevPage} next={nextPage} />
    );
  };

  render() {
    const { pages, prevPages, nextPages, ...rest } = this.props;

    return (
      <ContentRouter
        {...rest}
        defaultPage={pages[0].name}
        notFoundPage="404"
        onRoute={this.onRoute}
      >
        <div page="404">Not Found Page!</div>
      </ContentRouter>
    );
  }
}

export default view(PageRouter);
