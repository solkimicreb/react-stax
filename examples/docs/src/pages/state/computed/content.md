# Computed Data

Store data can be dynamically derived with standard JavaScript getters.

```js
import { store } from 'react-easy-stack';

const user = store({
  firstName: 'Dan',
  lastName: 'Developer',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
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

Using a mix of normal and getter properties with separate <span id="mutators-link"></span> is an elegant state management pattern.

> Getters are always called with the correct `this`, you can safely use it inside them.

## deriveStoresFromProps

Deriving local stores from props is possible with the `deriveStoresFromProps` static method, which is a mirror of React's `getDerivedStateFromProps`.

It has the `deriveStoresFromProps(nextProps, ...stores)` signature, where `...stores` are the local stores of the component. Unlike in `getDerivedStateFromProps`, you can directly mutate the stores inside the method and the return value is ignored.

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

This search component has an encapsulated value, that can be overridden by props with the help of `deriveStoresFromProps`.
