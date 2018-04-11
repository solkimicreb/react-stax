import React from 'react';
import { store, view } from 'react-easy-stack';
import styled from 'styled-components';
import { colors, ease } from './theme';

let timeout;
const notificationStore = store({
  message: '',
  action: undefined,
  isOpen: false
});

const StyledNotification = styled.div`
  position: fixed;
  bottom: 15px;
  right: 80px;
  width: 250px;
  height: 40px;
  padding: 9px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  color: ${colors.textLight};
  background-color: ${colors.background};
  transform: ${props => (props.open ? 'none' : 'translateY(55px)')};
  transition: all 0.1s ${props => (props.open ? ease.out : ease.in)};
  z-index: 10;
  font-size: 16px;
`;

export function notify(message, action) {
  notificationStore.message = message;
  notificationStore.action = action;
  notificationStore.open = true;
  clearTimeout(timeout);
  timeout = setTimeout(closeNotification, 5000);
}

function closeNotification() {
  notificationStore.message = '';
  notificationStore.action = undefined;
  notificationStore.open = false;
}

export default view(() => {
  const { open, action, message } = notificationStore;

  return (
    <StyledNotification open={open} onClick={action}>
      {message}
    </StyledNotification>
  );
});
