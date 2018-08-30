import React, { Component } from 'react'
import styled from 'styled-components'
import { Router, view, session, path } from 'react-stax'
import { ease, layout } from './theme'
import * as sidebar from './Sidebar'
import { notify } from './Notification'
import * as routes from '../routes'

let prevSession = {}

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

    const pathname = '/' + path.join('/')
    const page = pages.find(page => page.path.indexOf(pathname) === 0)
    const isLeaf = pages.some(page => page.name === pageName)
    const idx = routes.all.indexOf(page)
    const prevPage = routes.all[idx - 1]
    const nextPage = routes.all[idx + 1]

    return {
      idx,
      isLeaf,
      page,
      prevPage,
      nextPage
    }
  }

  onRoute = async ({ fromPage, toPage }) => {
    const { idx, page, prevPage, nextPage, isLeaf } = this.getPages(toPage)

    session.fromIdx = prevSession.idx
    Object.assign(session, page)
    console.log(session, prevSession, page)
    prevSession = session

    if (fromPage !== toPage && isLeaf) {
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
    console.log('session', session.idx, session.fromIdx)
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
