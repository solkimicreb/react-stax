import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { path, view, params, store, Router, Link } from 'react-easy-stack';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import App from './components/App';
import Page from './components/Page';
import PageRouter from './components/PageRouter';
import AnimatedRouter from './components/AnimatedRouter';
import Notification, { notify } from './components/Notification';
import Switch from './components/Switch';
import { TopLink, SideLink, SideSectionLink } from './components/Link';
import Actionbar from './components/Actionbar';
import { layout } from './components/theme';
import routes from './routes';

const SideNav = () => (
  <Sidebar>
    <AnimatedRouter defaultPage="home">
      <div page="home">
        {routes.home.map(page => (
          <SideSectionLink to={page.path} key={page.name}>
            {page.title}
          </SideSectionLink>
        ))}
      </div>
      <div page="docs">
        <SideSectionLink to="state">State Management</SideSectionLink>
        {routes.docs.state.map(page => (
          <SideLink to={page.path} key={page.name}>
            {page.title}
          </SideLink>
        ))}
        <SideSectionLink to="routing">Routing</SideSectionLink>
        {routes.docs.routing.map(page => (
          <SideLink to={page.path} key={page.name}>
            {page.title}
          </SideLink>
        ))}
      </div>
      <div page="examples">
        {routes.examples.map(page => (
          <SideLink to={page.path} key={page.name}>
            {page.title}
          </SideLink>
        ))}
      </div>
    </AnimatedRouter>
  </Sidebar>
);

const Content = () => (
  <AnimatedRouter defaultPage="home" debug="main">
    <PageRouter page="home" pages={routes.home} nextPages={routes.docs.state} />
    <AnimatedRouter page="docs" defaultPage="state" debug="docs">
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
    </AnimatedRouter>
    <PageRouter page="examples" pages={routes.examples} />
  </AnimatedRouter>
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
