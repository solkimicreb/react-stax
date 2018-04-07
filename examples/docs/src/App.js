import React, { Fragment } from 'react';
import { path } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import Router from './components/Router';
import { TopLink, SideLink } from './components/Link';

async function resolveRoute({ page }) {
  return {
    html: await import(`./route/${page}.md`)
  };
}

async function resolveState({ page }) {
  return {
    html: await import(`./state/${page}.md`)
  };
}

const State = () => (
  <Router defaultPage="intro">
    <Page page="intro" resolve={resolveState} />
    <Page page="stuff" resolve={resolveState} />
  </Router>
);

const Routing = () => (
  <Router defaultPage="advanced">
    <Page page="advanced" resolve={resolveRoute} />
    <Page page="base" resolve={resolveRoute} />
  </Router>
);

const DocsContent = () => (
  <Router defaultPage="state">
    <State page="state" />
    <Routing page="route" />
  </Router>
);

const DocsNav = () => (
  <Router defaultPage="docs">
    <div page="docs">
      <SideLink to="route">Route</SideLink>
      <SideLink to="state">State</SideLink>
      <Router defaultPage="state">
        <div page="route">
          <SideLink to="advanced">Advanced</SideLink>
          <SideLink to="base">Base</SideLink>
        </div>
        <div page="state">
          <SideLink to="intro">Introduction</SideLink>
          <SideLink to="stuff">Stuff</SideLink>
        </div>
      </Router>
    </div>
  </Router>
);

const Content = () => (
  <Router defaultPage="home">
    <Page page="home">HOME</Page>
    <Page page="examples">EXAMPLES</Page>
    <DocsContent page="docs" />
  </Router>
);

const Nav = () => (
  <Fragment>
    <TopLink to="home">Home</TopLink>
    <TopLink to="docs">Docs</TopLink>
    <TopLink to="examples">Examples</TopLink>
  </Fragment>
);

export default () => (
  <Fragment>
    <Topbar>
      <Nav />
    </Topbar>
    <Sidebar>
      <DocsNav />
    </Sidebar>
    <App>
      <Content />
    </App>
  </Fragment>
);
