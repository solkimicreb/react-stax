import React, { Fragment } from 'react';
import { path, Router as OriginalRouter } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import Router from './components/Router';
import { TopLink, SideLink, SideSectionLink } from './components/Link';

async function resolveRoute({ toPage }) {
  const html = await import(`./route/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

async function resolveState({ toPage }) {
  const html = await import(`./state/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

const State = () => <Router defaultPage="intro" onRoute={resolveState} />;
const Routing = () => <Router defaultPage="advanced" onRoute={resolveRoute} />;

const DocsContent = () => (
  <Router defaultPage="state">
    <State page="state" />
    <Routing page="route" />
  </Router>
);

const DocsNav = () => (
  <div>
    <SideSectionLink to="/docs/state">State</SideSectionLink>
    <div page="state">
      <SideLink to="/docs/state/intro">Introduction</SideLink>
      <SideLink to="/docs/state/stuff">Stuff</SideLink>
    </div>
    <SideSectionLink to="/docs/route">Route</SideSectionLink>
    <div page="route">
      <SideLink to="/docs/route/advanced">Advanced</SideLink>
      <SideLink to="/docs/route/base">Base</SideLink>
    </div>
  </div>
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
