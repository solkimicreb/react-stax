import { observable, observe } from "@nx-js/observer-util";
import scheduler from "./scheduler";
import { toQuery, toParams, toPathArray, toPathString } from "../utils";

export const params = observable(toParams(location.search));
export const path = observable(toPathArray(location.pathname));

function syncUrl() {
  const url = toPathString(path) + toQuery(params) + location.hash;
  history.replaceState(history.state, "", url);
}

observe(syncUrl, { scheduler });
