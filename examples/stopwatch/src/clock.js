import { store } from "react-easy-stack";
import moment from "moment";

let intervalId;

const clock = store({
  ticks: 0,
  get isTicking() {
    return intervalId !== undefined;
  },
  get time() {
    const time = moment(0).millisecond(this.ticks * 10);

    return {
      seconds: time.format("mm:ss"),
      fraction: time.format("SS")
    };
  }
});

export function start() {
  intervalId = setInterval(() => clock.ticks++, 10);
}

export function stop() {
  intervalId = clearInterval(intervalId);
}

export function toggle() {
  clock.isTicking ? stop() : start();
}

export function reset() {
  clock.ticks = 0;
  stop();
}

export default clock;
