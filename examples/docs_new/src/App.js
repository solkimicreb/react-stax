import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import {
  path,
  view,
  params,
  store,
  storage,
  Router,
  Link,
  route
} from 'react-easy-stack'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import App from './components/App'
import Page from './components/Page'
import PageRouter from './components/PageRouter'
import ContentRouter from './components/ContentRouter'
import SidebarRouter from './components/SidebarRouter'
import Switch from './components/Switch'
import { TopLink, SideLink, SideSectionLink } from './components/Link'
import Actionbar from './components/Actionbar'
import { layout } from './components/theme'
import routes from './routes'

const DocsNav = () => (
  <div>
    <SideSectionLink to="state">State Management</SideSectionLink>
    {routes.docs.state.map(page => (
      <SideLink to={page.path} key={page.name}>
        {page.link || page.title}
      </SideLink>
    ))}
    <SideSectionLink to="routing">Routing</SideSectionLink>
    {routes.docs.routing.map(page => (
      <SideLink to={page.path} key={page.name}>
        {page.link || page.title}
      </SideLink>
    ))}
  </div>
)

const SideNav = () => (
  <Sidebar>
    <SidebarRouter defaultPage="home">
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
    </SidebarRouter>
  </Sidebar>
)

const Content = () => (
  <PageRouter
    defaultPage="home"
    pages={routes.home}
    nextPages={routes.docs.state}
  >
    <ContentRouter page="docs" defaultPage="state">
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
    </ContentRouter>
    <PageRouter
      page="examples"
      pages={routes.examples}
      nextPages={routes.faq}
    />
    <PageRouter page="faq" pages={routes.faq} prevPages={routes.examples} />
  </PageRouter>
)

const Nav = () => (
  <Fragment>
    <TopLink to="docs">Docs</TopLink>
    <TopLink to="examples">Examples</TopLink>
    <TopLink to="faq">FAQ</TopLink>
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
