import React, { Component } from 'react'
import styled from 'styled-components'
import { Router, view } from 'react-easy-stack'
import anime from 'animejs'
import { ease, layout } from './theme'
import * as sidebar from './Sidebar'
import { notify } from './Notification'

const StyledRouter = styled(Router)`
  overflow: hidden;

  > * {
    will-change: ${props => (props.isMobile ? 'transform' : 'opacity')};
  }
`

const enterAnimation = (elem, ctx) => {
  return elem.animate(
    layout.isMobile
      ? {
          transform: ['translateX(-100%)', 'none']
        }
      : { opacity: [0, 1] },
    { duration: layout.isMobile ? 220 : 150 }
  ).finished
}

const leaveAnimation = (elem, ctx) => {
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
          transform: ['none', 'translateX(100%)']
        }
      : { opacity: [1, 0] },
    { duration: layout.isMobile ? 220 : 150 }
  ).finished
}

class PageRouter extends Component {
  static defaultProps = {
    nextPages: [],
    prevPages: []
  }

  onRoute = async ({ toPage }) => {
    const { pages, prevPages, nextPages } = this.props
    const idx = pages.findIndex(page => page.name === toPage)
    const page = pages[idx]

    if (page) {
      const prevPage = pages[idx - 1] || prevPages[prevPages.length - 1]
      const nextPage = pages[idx + 1] || nextPages[0]

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
          data={page}
          prev={prevPage}
          next={nextPage}
        />
      )
    }
  }

  render() {
    const { pages, prevPages, nextPages, children, ...rest } = this.props

    return (
      <StyledRouter
        {...rest}
        defaultPage={pages[0].name}
        notFoundPage="404"
        onRoute={this.onRoute}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        {children}
        <div page="404">Not Found Page!</div>
      </StyledRouter>
    )
  }
}

export default view(PageRouter)
