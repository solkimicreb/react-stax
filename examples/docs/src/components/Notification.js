import React from "react";
import ReactDOM from "react-dom";
import { store, view } from "react-stax";
import styled from "styled-components";
import { colors, ease, layout } from "./theme";

let timeoutId;
const notificationStore = store({
  message: "",
  action: undefined,
  isOpen: false
});

const StyledNotification = styled.div`
  position: fixed;
  left: calc(50% + ${props => props.correction / 2}px);
  right: 0;
  bottom: ${props => (props.isMobile ? layout.actionbarHeight : 0)}px;
  width: 500px;
  height: ${layout.actionbarHeight}px;
  max-width: 100%;
  line-height: ${layout.actionbarHeight}px;
  text-align: center;
  border-radius: 3px;
  transform: translate3d(
    -50%,
    ${props => (props.open ? 0 : 2 * layout.actionbarHeight)}px,
    0
  );
  transition: transform 0.3s ${props => (props.open ? ease.out : ease.in)};
  color: ${colors.textLight};
  background-color: ${colors.background};
  cursor: pointer;
  font-size: 16px;
  z-index: 5;
`;

export function notify(message, action, timeout = 5000) {
  notificationStore.message = message;
  notificationStore.action = action;
  notificationStore.open = true;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(closeNotification, timeout);
}

function closeNotification() {
  notificationStore.message = "";
  notificationStore.action = undefined;
  notificationStore.open = false;
}

const Notification = view(() => {
  const { open, action, message } = notificationStore;

  return (
    <StyledNotification
      open={open}
      isMobile={layout.isMobile}
      onClick={action}
      correction={layout.correction}
    >
      {message}
    </StyledNotification>
  );
});

ReactDOM.render(<Notification />, document.getElementById("notification"));
