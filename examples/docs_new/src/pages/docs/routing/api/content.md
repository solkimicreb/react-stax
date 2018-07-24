## Router component

### Description

### Properties

- `defaultPage`: A required string, which must match with a Router child's `page` prop. This will be the default page the Router routes to in case of no url pathname token.

- `notFoundPage`: An optional string, which must match with a Router child's `page` prop. This will be the default page when there is a url pathname token, but it matches with no Router child.

- `onRoute`: An optional function, which is called whenever the Router is routing.

  **Arguments**: a single object, with the following properties.

  - `fromPage`: The name of the previous page.
  - `toPage`: The name of the next page.
  - `target`: The Router instance with a `route()` method.

  **Expected return value**:

  - An object, which will be merged with the next page component's props.
  - Or a Promise which is awaited before the routing is continued.

- `shouldAnimate`: An optional function, which determines if the Router should animate between pages.

  **Arguments**: a single object, with the following properties.

  - `fromPage`: The name of the previous page.
  - `toPage`: The name of the next page.

  **Expected return value**: a boolean. If true the Router animates, otherwise it does not. By default it animates if `fromPage !== toPage`.

- `enterAnimation`: An optional function, which animates the entering Router child on page transitions.

  **Arguments**: the DOM node of the entering page.

  **Expected return value**: a Promise, which resolves when the animation finishes.

- `leaveAnimation`: An optional function, which animates the leaving Router child on page transitions.

  **Arguments**: the DOM node of the leaving page.

  **Expected return value**: a Promise, which resolves when the animation finishes.

- `element`: An optional HTML element name or React component. It is a `div` by default.

- Everything else is forwarded to the underlying DOM element.

## Link component

### Description

### Properties

- `to`: An optional string, which determines what page the Link should route to. It may be a relative or an absolute path.

- `params`: An optional object, which determines the initial parameter pool for the next page.

- `scroll`: An optional object which describes the scroll handling logic for the routing.
  **Properties**:

  -

- `push`: An optional boolean, which toggles if the routing should push a new history item or replace the current one. By default a new history item is pushed if the routing results in a page change.

- `inherit`: An optional boolean, which toggles if the routing should inherit the old parameter pool and merge it with the new one or completely replace it.

- `onClick`: An optional, function which is called on Link clicks, before the routing process starts.

  **Arguments:** A standard React click event. You can call `event.preventDefault()` to prevent the routing process.

- `isActive`: An optional function, which may customize when the Link is active.

- `activeClass`: An optional class name, which is added to the underlying DOM element, when the Link is active.

- `activeStyle`: An optional style object, which is merged with the Link's style when it is active.

- `element`: An optional HTML element name or React component. It is an `anchor` by default.

- Everything else is forwarded to the underlying DOM element.

## route()
