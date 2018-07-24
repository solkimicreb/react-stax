Easy Stack is calling a dummy `setState()` on the related components whenever a store property mutates. This means that the usual batching rules of `setState` applies in case of store mutations.

- Everything inside an event handler is batched and committed in one batch at the end of the handler.
- In all other cases `setState` is triggering an immediate synchronous re-render.

This will likely change with the introduction of async rendering.

## Manual update batching

You can manually batch store mutations by wrapping them with the `flushSync()` function from ReactDOM. This ensures that the mutations will trigger a single re-render only.

```js
import ReactDOM from 'react-dom';
import { store } from 'react-easy-stack';

const user = store({});

export function logout() {
  ReactDOM.flushSync(() => {
    user.isLoggedIn = false;
    user.profile = {};
  });
}
```

## When to batch?

> React's render scheduler is in the middle of an upgrade. There will likely be an automatic default batcher for all cases in the future, so it is better to avoid manual batching.

In the current React version event handlers are batched, so it only makes sense to batch in functions, which are not called on events. The other typical trigger effects are network responses and timers. Batching these will cause the app the render less, but in the next version of React this will probably become pointless. Maybe even harmful, as it opts out from the future async rendering pipeline. I would suggest you to don't batch manually unless you have performance issues.
