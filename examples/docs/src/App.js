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

async function resolveRouting({ toPage }) {
  const { default: RoutingPage } = await import(`./pages/routing/${toPage}`);
  return <RoutingPage page={toPage} />;
}

async function resolveState({ toPage }) {
  const { default: StatePage } = await import(`./pages/state/${toPage}`);
  return <StatePage page={toPage} />;
}

async function resolveHome({ toPage }) {
  const { default: HomePage } = await import(`./pages/home/${toPage}`);
  return <HomePage page={toPage} />;
}

async function resolveExample({ toPage }) {
  const html = await import(`./pages/examples/${toPage}.md`);
  return <Page page={toPage} html={html} />;
}

const State = () => (
  <PageRouter defaultPage="intro" onRoute={resolveState} debug="state" />
);
const Routing = () => (
  <PageRouter defaultPage="intro" onRoute={resolveRouting} debug="routing" />
);
const Home = () => (
  <PageRouter defaultPage="intro" onRoute={resolveHome} debug="home" />
);

const SideNav = () => (
  <Sidebar>
    <PageRouter defaultPage="home">
      <div page="home">
        <SideSectionLink to="intro">Introduction</SideSectionLink>
        <SideSectionLink to="platforms">Platform Support</SideSectionLink>
        <SideSectionLink to="performance">Performance</SideSectionLink>
      </div>
      <div page="docs">
        <SideSectionLink to="state">State Management</SideSectionLink>
        <SideLink to="state/intro">Introduction</SideLink>
        <SideLink to="state/mutations">Mutating the Stores</SideLink>
        <SideLink to="state/computed">Computed Data</SideLink>
        <SideLink to="state/batching">Batching Updates</SideLink>
        <SideLink to="state/api">API Summary</SideLink>
        <SideSectionLink to="routing">Routing</SideSectionLink>
        <SideLink to="routing/intro">Introduction</SideLink>
        <SideLink to="routing/nested">Nested Routing</SideLink>
        <SideLink to="routing/params">Parameters</SideLink>
        <SideLink to="routing/intercept">Interception</SideLink>
        <SideLink to="routing/lazy">Lazy Loading</SideLink>
        <SideLink to="routing/scroll">Scroll Handling</SideLink>
        <SideLink to="routing/animations">Animations</SideLink>
        <SideLink to="routing/advanced">Advanced Patterns</SideLink>
        <SideLink to="routing/api">API Summary</SideLink>
      </div>
      <div page="examples">
        <SideSectionLink to="clock-local">Local Clock</SideSectionLink>
        <SideSectionLink to="clock-global">Glocal Clock</SideSectionLink>
      </div>
    </PageRouter>
  </Sidebar>
);

const DocsContent = () => (
  <PageRouter defaultPage="state" debug="docs">
    <State page="state" />
    <Routing page="routing" />
  </PageRouter>
);

const Content = () => (
  <PageRouter defaultPage="home" debug="main">
    <Home page="home" />
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
    <SideNav />
    <Chat
      id="chat"
      className="gitter-chat-embed is-collapsed"
      isMobile={layout.isMobile}
    />
    {layout.isMobile && <Actionbar />}
    <Notification />
  </Fragment>
));
