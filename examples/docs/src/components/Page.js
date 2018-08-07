import React, { Component, Fragment, Children } from 'react'
import ReactDOM from 'react-dom'
import { store, view, Link } from 'react-stax'
import styled from 'styled-components'
import BackIcon from 'react-icons/lib/fa/angle-left'
import ForwardIcon from 'react-icons/lib/fa/angle-right'
import { colors, layout } from './theme'

const StyledPage = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 60px;
  padding-top: 30px;

  pre {
    background-color: ${colors.code};
    color: ${colors.text};
    width: ${props => (props.isMobile ? '100vw' : '100%')};
    margin-left: ${props => (props.isMobile ? -15 : 0)}px;
    margin-right: ${props => (props.isMobile ? -15 : 0)}px;
    border-radius: ${props => (props.isMobile ? 0 : 3)}px;
  }

  .demo {
    display: block;
    width: ${props => (props.isMobile ? '100vw' : '100%')};
    height: 400px;
    margin-left: ${props => (props.isMobile ? -15 : 0)}px;
    margin-right: ${props => (props.isMobile ? -15 : 0)}px;
    border: 1px solid ${colors.background};
    border-radius: ${props => (props.isMobile ? 0 : 3)}px;
    overflow: hidden;
    margin-bottom: 16px;
  }
`

const Stepper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  a {
    display: flex;
    align-items: center;
  }
  svg {
    height: 30px;
    width: 30px;
  }
`

class Page extends Component {
  store = store({
    didMount: false
  })

  componentDidMount() {
    const { children, curr } = this.props
    Children.forEach(children, child => {
      if (child.props.mount) {
        ReactDOM.render(child, document.getElementById(child.props.mount))
      }
    })
    this.store.didMount = true
  }

  render() {
    const { html, curr, prev, next, children, ...rest } = this.props
    const { didMount } = this.store

    return (
      <StyledPage
        isMobile={layout.isMobile}
        className="markdown-body"
        {...rest}
      >
        {curr.title && <h1>{curr.title}</h1>}
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {didMount &&
          Children.map(children, child => {
            const { portal } = child.props
            if (!portal) {
              return null
            }
            const portalNode = document.getElementById(portal)
            const { textContent } = portalNode
            if (textContent) {
              child = React.cloneElement(child, {}, textContent)
            }
            return ReactDOM.createPortal(child, portalNode)
          })}
        <Stepper>
          <div>
            {prev && (
              <Link to={prev.path}>
                <BackIcon /> {prev.title || prev.link}
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link to={next.path}>
                {next.title || next.link} <ForwardIcon />
              </Link>
            )}
          </div>
        </Stepper>
      </StyledPage>
    )
  }
}

export default view(Page)
