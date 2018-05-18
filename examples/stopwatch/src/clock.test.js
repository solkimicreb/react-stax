import sinon from "sinon";
import { tz as timezone } from "moment-timezone";
import clock, { reset, toggle, start } from "./clock";

describe("Stopwatch store", () => {
  const timers = sinon.useFakeTimers();
  timezone.setDefault("UTC");

  afterEach(() => {
    reset();
  });

  afterAll(() => {
    timers.restore();
    timezone.setDefault();
  });

  test("should be idle when needed", () => {
    expect(clock.ticks).toBe(0);

    timers.tick(2000);
    expect(clock.ticks).toBe(0);
  });

  test("should start and stop", () => {
    toggle();

    timers.tick(2000);
    expect(clock.ticks).toBe(200);

    toggle();
    timers.tick(4000);
    expect(clock.ticks).toBe(200);
  });

  test("should reset", () => {
    start();
    timers.tick(3000);
    expect(clock.ticks).toBe(300);

    reset();
    expect(clock.ticks).toBe(0);
  });

  test("should format the time", () => {
    start();
    timers.tick(132020);
    expect(clock.time).toEqual({
      seconds: "02:12",
      fraction: "02"
    });
  });
});
