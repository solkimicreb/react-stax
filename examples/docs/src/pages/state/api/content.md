## store(obj)

#### Parameters

* `obj`: An object, which can also be an array, Map or Set.

#### Return value

The passed object, wrapped in a transparent Proxy.

#### Description

Wraps the object with a reactive layer, that is invisible from the outside. The returned object behaves exactly like the passed one.

## view(Comp)

#### Parameters

* `Comp`: A React component, which can be a function or a class.

#### Return value

A wrapping higher order component over the passed component.

#### Description

Wraps the passed component with a reactive one, which re-renders when the reactive data - used inside its render - is mutated.

### Comp.deriveStoresFromProps(props, ...stores)

#### Parameters

* `props`: The next props object of the components.
* `...stores`: The local stores of the component in property declaration order.

#### Description

Component wrapped with `view()` receive a new static `deriveStoresFromProps` lifecycle method. You can mutate the component's local stores directly inside it with data from the next props.
