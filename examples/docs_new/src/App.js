import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { path, view, params, store, Router, Link } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import App from './components/App';
import Page from './components/Page';
import PageRouter from './components/PageRouter';
import ContentRouter from './components/ContentRouter';
import SidebarRouter from './components/SidebarRouter';
import Notification, { notify } from './components/Notification';
import Switch from './components/Switch';
import { TopLink, SideLink, SideSectionLink } from './components/Link';
import Actionbar from './components/Actionbar';
import { layout } from './components/theme';
import routes from './routes';

const DocsNav = () => (
  <div>
    <SideSectionLink to="state">State Management</SideSectionLink>
    {routes.docs.state.map(page => (
      <SideLink to={page.path} key={page.name}>
        {page.link || page.title}
      </SideLink>
    ))}
    <SideSectionLink to="routing">Routing</SideSectionLink>
    {routes.docs.routing.map(page => (
      <SideLink to={page.path} key={page.name}>
        {page.link || page.title}
      </SideLink>
    ))}
  </div>
);

const SideNav = () => (
  <Sidebar>
    <SidebarRouter defaultPage="home">
      <div page="home">
        {routes.home.map(page => (
          <SideSectionLink to={page.path} key={page.name}>
            {page.link || page.title}
          </SideSectionLink>
        ))}
      </div>
      <DocsNav page="docs" />
      <div page="examples">
        {routes.examples.map(page => (
          <SideLink to={page.path} key={page.name}>
            {page.link || page.title}
          </SideLink>
        ))}
      </div>
    </SidebarRouter>
  </Sidebar>
);

const Content = () => (
  <ContentRouter defaultPage="home">
    <PageRouter page="home" pages={routes.home} nextPages={routes.docs.state} />
    <ContentRouter page="docs" defaultPage="state">
      <PageRouter
        page="state"
        pages={routes.docs.state}
        prevPages={routes.home}
        nextPages={routes.docs.routing}
      />
      <PageRouter
        page="routing"
        pages={routes.docs.routing}
        prevPages={routes.docs.state}
      />
    </ContentRouter>
    <PageRouter page="examples" pages={routes.examples} />
  </ContentRouter>
);

const Nav = () => (
  <Fragment>
    <TopLink to="home">Home</TopLink>
    <TopLink to="docs">Docs</TopLink>
    <TopLink to="examples">Examples</TopLink>
  </Fragment>
);

export default view(() => (
  <Fragment>
    <Topbar>
      <Nav />
    </Topbar>
    <App>
      <Content />
    </App>
    <SideNav />
    <Chat />
    {layout.isMobile && <Actionbar />}
    <Notification />
  </Fragment>
));