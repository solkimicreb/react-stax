import React from "react";
import { store, view } from "react-easy-stack";
import styled from "styled-components";
import { colors, ease, layout } from "./theme";

let timeout;
const notificationStore = store({
  message: "",
  action: undefined,
  isOpen: false
});

const Notification = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${props => (props.isMobile ? layout.actionbarHeight : 0)}px;
  transform: translateY(
    ${props => (props.open ? 0 : layout.actionbarHeight)}px
  );
  transition: all 0.1s ${props => (props.open ? ease.out : ease.in)};
`;

const NotificationBody = styled.div`
  width: 700px;
  max-width: 100%;
  margin: auto;
  height: ${layout.actionbarHeight}px;
  line-height: ${layout.actionbarHeight}px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  color: ${colors.textLight};
  background-color: ${colors.background};
  font-size: 16px;
  z-index: 5;
`;

export function notify(message, action) {
  notificationStore.message = message;
  notificationStore.action = action;
  notificationStore.open = true;
  clearTimeout(timeout);
  timeout = setTimeout(closeNotification, 5000);
}

function closeNotification() {
  notificationStore.message = "";
  notificationStore.action = undefined;
  notificationStore.open = false;
}

export default view(() => {
  const { open, action, message } = notificationStore;

  return (
    <Notification open={open} isMobile={layout.isMobile}>
      <NotificationBody onClick={action}>{message}</NotificationBody>
    </Notification>
  );
});
