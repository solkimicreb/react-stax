const isNode =
  typeof global === "object" &&
  global.process &&
  Object.prototype.toString.call(global.process) === "[object process]";
const isBrowser = !isNode;
const noop = () => null;

export const history = isBrowser
  ? window.history
  : {
      replaceState: noop,
      pushState: noop
    };

export const localStorage = isBrowser
  ? window.localStorage
  : {
      getItem: noop,
      setItem: noop
    };
