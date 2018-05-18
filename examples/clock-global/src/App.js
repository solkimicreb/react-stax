import React from "react";
import moment from "moment";
import { view, store } from "react-easy-stack";

export const clock = store({
  init() {
    clock.updateTime();
    setInterval(clock.updateTime, 1000);
  },
  updateTime() {
    clock.time = moment().format("hh:mm:ss A");
  }
});

export const App = view(() => <div>{clock.time}</div>);
