import { observable, observe } from "@nx-js/observer-util";
import { localStorage } from "../env";
import scheduler from "./scheduler";

const STORAGE_NAME = "REACT_EASY_STORAGE";
const item = localStorage.getItem(STORAGE_NAME);
export const storage = observable(JSON.parse(item) || {});

function syncStorage() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
}

observe(syncStorage, { scheduler });
