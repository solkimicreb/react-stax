import React, { Component, Fragment } from 'react'
import { store, view, path, route, params } from 'react-stax'
import styled from 'styled-components'
import Drawer from './Drawer'
import { colors, ease, layout } from './theme'

export const chatStore = store({
  get open() {
    return layout.isLarge || params.chat
  }
})

export function open() {
  route({ params: { chat: true }, push: layout.isMobile })
}

export function close() {
  route({ push: layout.isMobile })
}

export function toggle() {
  if (!chatStore.open) {
    open()
  } else {
    close()
  }
}

const StyledChat = styled(Drawer)`
  width: ${layout.chatWidth}px;

  iframe {
    height: 100%;
    width: 100%;
    border: none;
  }
`

class Chat extends Component {
  render() {
    return layout.currentPage.chat !== false ? (
      <StyledChat
        docked={layout.isLarge}
        open={chatStore.open}
        onOpen={open}
        onClose={close}
        touchZone={layout.touchZone}
        right
      >
        <iframe
          src="https://discordapp.com/widget?id=476396897549025283&theme=dark"
          allowtransparency="true"
          frameBorder="0"
        />
      </StyledChat>
    ) : null
  }
}

export default view(Chat)
