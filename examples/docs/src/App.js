import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { path, view, params, store, Router, Link } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import PageRouter from './components/PageRouter';
import Notification, { notify } from './components/Notification';
import Switch from './components/Switch';
import { TopLink, SideLink, SideSectionLink } from './components/Link';
import Actionbar from './components/Actionbar';
import { layout } from './components/theme';

async function resolveRoute({ toPage }) {
  const html = await import(`./pages/route/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

async function resolveState({ toPage }) {
  const html = await import(`./pages/state/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

async function resolveHome({ toPage }) {
  if (toPage === 'home') {
    const { default: HomePage } = await import('./pages/home');
    return <HomePage page={toPage} />;
  }
}

async function resolveExample({ toPage }) {
  const html = await import(`./pages/examples/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

const State = () => (
  <PageRouter defaultPage="intro" onRoute={resolveState} debug="state" />
);
const Routing = () => (
  <PageRouter defaultPage="advanced" onRoute={resolveRoute} debug="routing" />
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

const ExamplesNav = () => (
  <Switch page="examples">
    <Sidebar>
      <SideLink to="clock-local">Local Clock</SideLink>
      <SideLink to="clock-global">Glocal Clock</SideLink>
    </Sidebar>
  </Switch>
);

const DocsContent = () => (
  <PageRouter defaultPage="state" debug="docs">
    <State page="state" />
    <Routing page="route" />
  </PageRouter>
);

const Content = () => (
  <PageRouter defaultPage="home" onRoute={resolveHome} debug="main">
    <DocsContent page="docs" />
    <PageRouter
      page="examples"
      defaultPage="clock-local"
      onRoute={resolveExample}
    />
  </PageRouter>
);

const Nav = () => (
  <Fragment>
    <TopLink to="home">Home</TopLink>
    <TopLink to="docs">Docs</TopLink>
    <TopLink to="examples">Examples</TopLink>
  </Fragment>
);

const Chat = styled.div`
  width: 100%;
  max-width: 500px;
  z-index: ${props => (props.isMobile ? 70 : 10)};
  box-shadow: none;
  transition: transform 0.15s;
  border-left: solid 1px lightgray;
  will-change: transform;
  contain: strict;
`;

export default view(() => (
  <Fragment>
    <Topbar>
      <Nav />
    </Topbar>
    <App>
      <Content />
    </App>
    <DocsNav />
    <ExamplesNav />
    <Chat
      id="chat"
      className="gitter-chat-embed is-collapsed"
      isMobile={layout.isMobile}
    />
    {layout.isMobile && <Actionbar />}
    <Notification />
  </Fragment>
));
