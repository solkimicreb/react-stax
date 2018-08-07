import React, { Component } from 'react'
import styled from 'styled-components'
import { Router, view } from 'react-stax'
import { ease, layout } from './theme'
import * as sidebar from './Sidebar'
import { notify } from './Notification'

const StyledRouter = styled(Router)`
  overflow: hidden;

  > * {
    will-change: ${props => (props.isMobile ? 'transform' : 'opacity')};
  }
`

class PageRouter extends Component {
  static defaultProps = {
    pages: [],
    nextPages: [],
    prevPages: []
  }

  getPages = pageName => {
    const { pages, prevPages, nextPages } = this.props

    const idx = pages.findIndex(page => page.name === pageName)
    const page = pages[idx]

    let prevPage = pages[idx - 1]
    if (!prevPage || prevPage.virtual) {
      prevPage = prevPages.reverse().find(page => !page.virtual)
    }

    let nextPage = pages[idx + 1]
    if (!nextPage || nextPage.virtual) {
      nextPage = nextPages.find(page => !page.virtual)
    }

    return {
      idx,
      page,
      prevPage,
      nextPage
    }
  }

  onRoute = async ({ toPage }) => {
    const { page, prevPage, nextPage } = this.getPages(toPage)

    if (page && !page.virtual) {
      // TODO: rework this with lazy mode, prefetch and http2
      const { default: NextPage } = await import(/* webpackMode: "eager" */
      /* webpackChunkName: "pages" */
      `../pages${page.path}`)

      layout.currentPage = page
      let title = 'React Stax'
      if (page.title) {
        title = `${page.title} | ${title}`
      }
      document.title = title

      sidebar.close()

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

  isForward = ({ fromPage, toPage }) => {
    const { idx: fromIdx } = this.getPages(fromPage)
    const { idx: toIdx } = this.getPages(toPage)

    return fromIdx < toIdx
  }

  enterAnimation = (elem, ctx) => {
    const { page, prevPage, nextPage } = this.getPages(ctx)

    return elem.animate(
      layout.isMobile
        ? {
            transform: [
              `translateX(${this.isForward(ctx) ? 100 : -100}%)`,
              'none'
            ]
          }
        : { opacity: [0, 1] },
      { duration: layout.isMobile ? 220 : 150 }
    ).finished
  }

  leaveAnimation = (elem, ctx) => {
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
              `translateX(${this.isForward(ctx) ? -100 : 100}%)`
            ]
          }
        : { opacity: [1, 0] },
      { duration: layout.isMobile ? 220 : 150 }
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
