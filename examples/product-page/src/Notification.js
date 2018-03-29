import React from 'react';
import { store, view } from 'react-easy-stack';
import Snackbar from 'material-ui/Snackbar';

const notificationStore = store({
  message: '',
  isOpen: false
});

export function notify(message) {
  notificationStore.message = message;
  notificationStore.isOpen = true;
}

function closeNotification() {
  notificationStore.message = '';
  notificationStore.isOpen = false;
}

export default view(() => (
  <Snackbar
    open={notificationStore.isOpen}
    onClose={closeNotification}
    message={notificationStore.message}
    key={notificationStore.message}
    autoHideDuration={5000}
  />
));
