import React, { Component, Fragment } from 'react'
import { store, view, path } from 'react-stax'
import styled from 'styled-components'
import Drawer from './Drawer'
import { colors, ease, layout } from './theme'

export const chatStore = store({
  open: layout.isLarge
})

export function open() {
  chatStore.open = true
}

export function close() {
  chatStore.open = false
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
        touchZone={15}
        right
      >
        <iframe
          src="https://discordapp.com/widget?id=476396897549025283&theme=dark"
          allowtransparency="true"
          frameborder="0"
        />
      </StyledChat>
    ) : null
  }
}

export default view(Chat)
