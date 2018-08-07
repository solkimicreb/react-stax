import React from 'react';
import ReactDOM from 'react-dom';
import { store, view } from 'react-stax';
import styled from 'styled-components';
import { colors, ease, layout } from './theme';

let timeoutId;
const notificationStore = store({
  message: '',
  action: undefined,
  isOpen: false
});

const StyledNotification = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${props => (props.isMobile ? layout.actionbarHeight : 0)}px;
  transform: translateY(
    ${props => (props.open ? 0 : 2 * layout.actionbarHeight)}px
  );
  transition: all 0.1s ${props => (props.open ? ease.out : ease.in)};
`;

const NotificationBody = styled.div`
  position: relative;
  left: ${props => props.correction / 2}px;
  width: 770px;
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

export function notify(message, action, timeout = 5000) {
  notificationStore.message = message;
  notificationStore.action = action;
  notificationStore.open = true;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(closeNotification, timeout);
}

function closeNotification() {
  notificationStore.message = '';
  notificationStore.action = undefined;
  notificationStore.open = false;
}

const Notification = view(() => {
  const { open, action, message } = notificationStore;

  return (
    <StyledNotification open={open} isMobile={layout.isMobile}>
      <NotificationBody onClick={action} correction={layout.correction}>
        {message}
      </NotificationBody>
    </StyledNotification>
  );
});

ReactDOM.render(<Notification />, document.getElementById('notification'));
