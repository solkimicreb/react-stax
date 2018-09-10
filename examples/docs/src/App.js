import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { path, view, params, store, storage, Router } from 'react-stax'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import App from './components/App'
import Page from './components/Page'
import PageRouter from './components/PageRouter'
import NavRouter from './components/NavRouter'
import { TopLink, SideLink, SideSectionLink } from './components/Link'
import Actionbar from './components/Actionbar'
import { layout } from './components/theme'
import * as routes from './routes'

import './components/navigation'

const DocsNav = () => (
  <div>
    <SideSectionLink to="/docs/state">State Management</SideSectionLink>
    {routes.state.map(page => (
      <SideLink to={page.path} key={page.name}>
        {page.link || page.title}
      </SideLink>
    ))}
    <SideSectionLink to="/docs/routing">Routing</SideSectionLink>
    {routes.routing.map(page => (
      <SideLink to={page.path} key={page.name}>
        {page.link || page.title}
      </SideLink>
    ))}
  </div>
)

const SideNav = () => (
  <Sidebar>
    <NavRouter defaultPage="home">
      <DocsNav page="docs" />
      <div page="examples">
        {routes.examples.map(page => (
          <SideLink to={page.path} key={page.name}>
            {page.link || page.title}
          </SideLink>
        ))}
      </div>
      <div page="faq">
        {routes.faq.map(page => (
          <SideSectionLink to={page.path} key={page.name}>
            {page.link || page.title}
          </SideSectionLink>
        ))}
      </div>
    </NavRouter>
  </Sidebar>
)

const Content = () => (
  <PageRouter pages={routes.main}>
    <PageRouter page="docs" defaultPage="state">
      <PageRouter page="state" pages={routes.state} />
      <PageRouter page="routing" pages={routes.routing} />
    </PageRouter>
    <PageRouter page="examples" pages={routes.examples} />
    <PageRouter page="faq" pages={routes.faq} />
  </PageRouter>
)

const Nav = () => (
  <Fragment>
    <TopLink to="/docs">Docs</TopLink>
    <TopLink to="/examples">Examples</TopLink>
    <TopLink to="/faq">FAQ</TopLink>
  </Fragment>
)

export default view(() => (
  <Fragment>
    <Topbar>
      <Nav />
    </Topbar>
    <App>
      <Content />
    </App>
    <SideNav />
    <Chat />
    {layout.isMobile && <Actionbar />}
  </Fragment>
))
