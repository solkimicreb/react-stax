import React, { Fragment } from 'react';
import { path, Router as OriginalRouter } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import Router from './components/Router';
import { TopLink, SideLink, SideSectionLink } from './components/Link';

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
    <OriginalRouter page="docs" defaultPage="state">
      <SideSectionLink to="/docs/state">State</SideSectionLink>
      <div page="state">
        <SideLink to="intro">Introduction</SideLink>
        <SideLink to="stuff">Stuff</SideLink>
      </div>
      <SideSectionLink to="/docs/route">Route</SideSectionLink>
      <div page="route">
        <SideLink to="advanced">Advanced</SideLink>
        <SideLink to="base">Base</SideLink>
      </div>
    </OriginalRouter>
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
