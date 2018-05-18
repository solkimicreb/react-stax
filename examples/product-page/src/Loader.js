import React from "react";
import { store, view } from "react-easy-stack";
import { LinearProgress } from "material-ui/Progress";

const loaderStore = store({
  isLoading: false
});

export function startLoading() {
  loaderStore.isLoading = true;
}

export function stopLoading() {
  loaderStore.isLoading = false;
}

export default view(
  () => (loaderStore.isLoading ? <LinearProgress color="secondary" /> : null)
);
