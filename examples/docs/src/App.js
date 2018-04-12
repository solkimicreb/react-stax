import React, { Fragment } from 'react';
import { path, view, Router } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import PageRouter from './components/PageRouter';
import SidebarRouter from './components/SidebarRouter';
import SectionRouter from './components/SectionRouter';
import Notification, { notify } from './components/Notification';
import Switch from './components/Switch';
import { TopLink, SideLink } from './components/Link';

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
      <SectionRouter page="state" name="State">
        <SideLink to="intro">Introduction</SideLink>
        <SideLink to="stuff">Stuff</SideLink>
      </SectionRouter>
      <SectionRouter page="route" name="Route">
        <SideLink to="advanced">Advanced</SideLink>
        <SideLink to="base">Base</SideLink>
      </SectionRouter>
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
    <Page page="home">HOME</Page>
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
