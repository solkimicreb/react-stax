Store data can be dynamically derived with standard JavaScript getters.

```jsx
import React from 'react';
import { store } from 'react-easy-stack';

const user = store({
  firstName: 'Dan',
  lastName: 'Developer',
  get fullName() {
    return `${user.firstName} ${user.lastName}`;
  }
});

const onChange = ev => (user[ev.target.name] = ev.target.value);

export default view(() => (
  <div>
    <input name="firstName" value={user.firstName} onChange={onChange} />
    <input name="lastName" value={user.lastName} onChange={onChange} />
    <p>Full name is: {user.fullName}</p>
  </div>
));
```

<div id="getter-demo"></div>

Using a mix of normal and getter properties in the stores with <span id="mutators-link"></span> is an elegant state management pattern.

> You can safely use `this` inside getters, if you prefer it over the direct store reference. Getters are always called with the correct `this`.

## deriveStoresFromProps

Deriving local store properties from component `props` is possible with the `deriveStoresFromProps` static method, which is mirrored from React's `getDerivedStateFromProps`.

It has a `deriveStoresFromProps(nextProps, ...stores)` signature, where `...stores` are the local stores of the component in definition order. You can directly mutate the stores inside the method and the return value is ignored - unlike in `getDerivedStateFromProps`.

```jsx
import React from 'react';
import { store, view } from 'react-easy-stack';

class SearchField extends Component {
  constructor(props) {
    super(props);
    this.store = store({ value: props.value });
  }

  static deriveStoresFromProps(props, store) {
    store.value = props.value;
  }

  onChange = ev => (this.store.value = ev.target.value);
  onKeyPress = ev => {
    if (ev.key === 'Enter') {
      this.props.onEnter(this.store.value);
    }
  };

  render() {
    return (
      <input
        value={this.store.value}
        onChange={this.onChange}
        onKeyPress={onKeyPress}
      />
    );
  }
}
export default view(SearchField);
```

This search component has an encapsulated store `value`, that can be overridden by props with the help of `deriveStoresFromProps`.
