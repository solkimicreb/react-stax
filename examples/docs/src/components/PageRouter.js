import React, { Component } from 'react'
import styled from 'styled-components'
import { Router, route, view, session, history } from 'react-stax'
import { ease, layout } from './theme'
import * as sidebar from './Sidebar'
import { notify } from './Notification'
import * as routes from '../routes'

const StyledRouter = styled(Router)`
  overflow: hidden;

  > * {
    will-change: ${props => (props.isMobile ? null : 'opacity')};
  }
`

class PageRouter extends Component {
  static defaultProps = {
    pages: []
  }

  getPages = pageName => {
    const { pages, prevPages, nextPages } = this.props

    let idx = pages.findIndex(page => page.name === pageName)
    const page = pages[idx]
    idx = routes.all.indexOf(page)
    const prevPage = routes.all[idx - 1]
    const nextPage = routes.all[idx + 1]

    return {
      idx,
      page,
      prevPage,
      nextPage
    }
  }

  onRoute = async ({ fromPage, toPage }) => {
    const { idx, page, prevPage, nextPage } = this.getPages(toPage)

    if (page) {
      session.page = page
      session.fromIdx = history.get(-1).session.idx
      session.idx = idx
    } else {
      Object.assign(session, history.get(-1).session)
    }

    if (fromPage !== toPage && page && !page.virtual) {
      // TODO: rework this with lazy mode, prefetch and http2
      const { default: NextPage } = await import(/* webpackMode: "eager" */
      /* webpackChunkName: "pages" */
      `../pages${page.path}`)

      sidebar.close()
      let title = 'React Stax'
      if (page.title) {
        title = `${page.title} | ${title}`
      }
      document.title = title

      return (
        <NextPage
          page={page.name}
          curr={page}
          prev={prevPage}
          next={nextPage}
        />
      )
    }
  }

  enterAnimation = elem => {
    return elem.animate(
      layout.isMobile
        ? {
            transform: [
              `translate3d(${
                session.fromIdx < session.idx ? 100 : -100
              }%, 0, 0)`,
              'none'
            ]
          }
        : { opacity: [0, 1] },
      { duration: layout.isMobile ? 400 : 140 }
    ).finished
  }

  leaveAnimation = elem => {
    const { top, left, width, height } = elem.getBoundingClientRect()

    Object.assign(elem.style, {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`
    })

    return elem.animate(
      layout.isMobile
        ? {
            transform: [
              'none',
              `translate3d(${
                session.fromIdx < session.idx ? -100 : 100
              }%, 0, 0)`
            ]
          }
        : { opacity: [1, 0] },
      { duration: layout.isMobile ? 400 : 140 }
    ).finished
  }

  render() {
    const { pages, prevPages, nextPages, children, ...rest } = this.props
    let { defaultPage } = this.props

    if (!defaultPage && pages) {
      defaultPage = pages[0].name
    }

    return (
      <StyledRouter
        {...rest}
        notFoundPage="404"
        defaultPage={defaultPage}
        onRoute={this.onRoute}
        enterAnimation={this.enterAnimation}
        leaveAnimation={this.leaveAnimation}
        isMobile={layout.isMobile}
      >
        {children}
        <div page="404">Not Found Page!</div>
      </StyledRouter>
    )
  }
}

export default view(PageRouter)
