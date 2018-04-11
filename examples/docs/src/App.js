import React, { Fragment } from 'react';
import { path, view, Switch } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import Router from './components/Router';
import Notification, { notify } from './components/Notification';
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

const DocsNav = () => (
  <Switch page="docs">
    <Sidebar>
      <SideSectionLink to="state">State</SideSectionLink>
      <Switch page="state">
        <SideLink to="intro">Introduction</SideLink>
        <SideLink to="stuff">Stuff</SideLink>
      </Switch>
      <SideSectionLink to="route">Route</SideSectionLink>
      <Switch page="route">
        <SideLink to="advanced">Advanced</SideLink>
        <SideLink to="base">Base</SideLink>
      </Switch>
    </Sidebar>
  </Switch>
);

const DocsContent = () => (
  <Router defaultPage="state">
    <State page="state" />
    <Routing page="route" />
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
    <DocsNav />
    <App>
      <Content />
    </App>
    <Notification />
  </Fragment>
);
