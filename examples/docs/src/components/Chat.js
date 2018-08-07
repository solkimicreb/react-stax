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

const StyledChat = styled.iframe`
  height: 100%;
  width: 100%;
  border: none;
`

class Chat extends Component {
  render() {
    return layout.currentPage.chat !== false ? (
      <Drawer
        width={layout.chatWidth}
        docked={layout.isLarge}
        right={true}
        open={chatStore.open}
        onOpen={open}
        onClose={close}
      >
        <StyledChat
          src="https://discordapp.com/widget?id=476396897549025283&theme=dark"
          allowtransparency="true"
          frameborder="0"
        />
      </Drawer>
    ) : null
  }
}

export default view(Chat)
