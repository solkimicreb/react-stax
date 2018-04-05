import React, { Fragment } from 'react';
import { Link, path } from 'react-easy-stack';
import ChatIcon from 'react-icons/lib/fa/comments-o';
import GithubIcon from 'react-icons/lib/fa/github';
import AppRouter from './AppRouter';
import NavRouter from './NavRouter';
import Sidebar, * as sidebar from './Sidebar';

const HTML = ({ __html }) => <div dangerouslySetInnerHTML={{ __html }} />;

const State = () => (
  <AppRouter defaultPage="intro">
    <HTML page="intro" resolve={resolveState} />
    <HTML page="stuff" resolve={resolveState} />
  </AppRouter>
);

const Routing = () => (
  <AppRouter defaultPage="advanced">
    <HTML page="advanced" resolve={resolveRoute} />
    <HTML page="base" resolve={resolveRoute} />
  </AppRouter>
);

const DocsNav = () => (
  <Fragment>
    <Link to="route" activeClass="active">
      Route
    </Link>
    <Link to="state" activeClass="active">
      State
    </Link>
    <NavRouter defaultPage="state" className="nav-router">
      <div page="route">
        <Link to="advanced" activeClass="active">
          Advanced
        </Link>
        <Link to="base" activeClass="active">
          Base
        </Link>
      </div>
      <div page="state">
        <Link to="intro" activeClass="active">
          Introduction
        </Link>
        <Link to="stuff" activeClass="active">
          Stuff
        </Link>
      </div>
    </NavRouter>
  </Fragment>
);

const docsStyle = {
  position: 'relative',
  left: sidebar.sidebarStore.open ? 125 : 0
};

const DocsContent = () => (
  <AppRouter defaultPage="state" className="page" style={docsStyle}>
    <State page="state" />
    <Routing page="route" />
  </AppRouter>
);

const Docs = () => (
  <Fragment>
    <Sidebar>
      <DocsNav />
    </Sidebar>
    <DocsContent />
  </Fragment>
);

async function resolveRoute({ page }) {
  return {
    __html: await import(`./route/${page}.md`)
  };
}

async function resolveState({ page }) {
  return {
    __html: await import(`./state/${page}.md`)
  };
}

const Content = () => (
  <AppRouter defaultPage="home" className="app">
    <h2 page="home" className="page">
      HOME
    </h2>
    <h2 page="examples" className="page">
      EXAMPLES
    </h2>
    <Docs page="docs" />
  </AppRouter>
);

const Nav = () => (
  <div className="topbar">
    <GithubIcon className="github-icon" />
    <div className="navbar">
      <Link to="home" activeClass="active">
        Home
      </Link>
      <Link to="docs" activeClass="active">
        Docs
      </Link>
      <Link to="examples" activeClass="active">
        Examples
      </Link>
    </div>
  </div>
);

export default () => (
  <div>
    <Nav />
    <Content />
    <button id="chat-toggle">
      <ChatIcon size={25} />
    </button>
  </div>
);
