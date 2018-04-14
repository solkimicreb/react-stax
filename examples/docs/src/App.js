import React, { Fragment } from 'react';
import { path, view, Router } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import PageRouter from './components/PageRouter';
import SidebarRouter from './components/SidebarRouter';
import Notification, { notify } from './components/Notification';
import Switch from './components/Switch';
import { TopLink, SideLink, SideSectionLink } from './components/Link';
import Actionbar from './components/Actionbar';
import { layout } from './components/theme';

async function resolveRoute({ toPage }) {
  const html = await import(`./route/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

async function resolveState({ toPage }) {
  const html = await import(`./state/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

const State = () => <PageRouter defaultPage="intro" onRoute={resolveState} />;
const Routing = () => (
  <PageRouter defaultPage="advanced" onRoute={resolveRoute} />
);

const DocsNav = () => (
  <Switch page="docs">
    <Sidebar>
      <SideSectionLink to="state">State</SideSectionLink>
      <SideLink to="state/intro">Introduction</SideLink>
      <SideLink to="state/stuff">Stuff</SideLink>
      <SideSectionLink to="route">Route</SideSectionLink>
      <SideLink to="route/advanced">Advanced</SideLink>
      <SideLink to="route/base">Base</SideLink>
    </Sidebar>
  </Switch>
);

const DocsContent = () => (
  <PageRouter defaultPage="state">
    <State page="state" />
    <Routing page="route" />
  </PageRouter>
);

const Content = () => (
  <PageRouter defaultPage="home">
    <State page="home" />
    <Page page="examples">EXAMPLES</Page>
    <DocsContent page="docs" />
  </PageRouter>
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
    <DocsNav />
    {layout.isMobile && <Actionbar />}
    <Notification />
  </Fragment>
));
