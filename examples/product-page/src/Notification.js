import React from "react";
import { store, view } from "react-easy-stack";
import Snackbar from "material-ui/Snackbar";

const notificationStore = store({
  message: "",
  action: undefined,
  isOpen: false
});

export function notify(message, action) {
  notificationStore.message = message;
  notificationStore.action = action;
  notificationStore.isOpen = true;
}

function closeNotification() {
  notificationStore.message = "";
  notificationStore.action = undefined;
  notificationStore.isOpen = false;
}

export default view(() => (
  <Snackbar
    open={notificationStore.isOpen}
    onClose={closeNotification}
    message={notificationStore.message}
    key={notificationStore.message}
    action={notificationStore.action}
    autoHideDuration={5000}
  />
));
