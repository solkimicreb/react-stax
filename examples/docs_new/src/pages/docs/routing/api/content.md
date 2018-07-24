## Router component

#### Properties

- `defaultPage`: A required string, which must match with a Router child's `page` prop. This will be the default page the Router routes to in case of no url pathname token.
- `notFoundPage`: An optional string, which must match with a Router child's `page` prop. This will be the default page when there is a url pathname token, but it matches with no Router child.
- `onRoute`: An optional function, which is called whenever the Router is routing. It can be used to <span id='intercept-link'>TODO</span>, <span id='params-link'>TODO</span>, <span id='resolve-link'>TODO</span> and <span id='lazy-link'>TODO</span>.
- `enterAnimation`: An optional function, which
- leaveAnimation: PropTypes.func,
- shouldAnimate: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
- element: PropTypes.oneOfType([PropTypes.string, PropTypes.func])

#### Description

Wraps the object with a reactive Proxy, that is invisible from the outside. The returned object behaves exactly like the passed one.

## view(Comp)

#### Parameters

- `Comp`: A React component, which can be a function or a class.

#### Return value

A wrapping higher-order component over the passed component.

#### Description

Wraps the passed component with a [higher-order component](https://reactjs.org/docs/higher-order-components.html), which re-renders when the reactive data - used inside its render - is mutated.

### Comp.deriveStoresFromProps(props, ...stores)

#### Parameters

- `props`: The next props object of the component.
- `...stores`: The local stores of the component in definition order.

#### Description

Components wrapped with `view()` receive a new static `deriveStoresFromProps` lifecycle method. You can mutate the component's local stores directly inside it with data from the next props.
