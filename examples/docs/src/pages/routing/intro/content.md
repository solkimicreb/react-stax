# Routing

Easy Stack clearly separates navigation from dynamic routing parameters. The url pathname is used for navigation in the [application shell](https://developers.google.com/web/fundamentals/architecture/app-shell) and it does not store any parameters.

The query string stores the dynamic parameters, which ideally define the data shell. The data shell is a minimal set of primitives, which define the current application state. It usually consists of user inputs.

## The Router component

The `Router` component checks the url pathname token at the appropriate depth and renders the child with the matching `page` attribute. There can never be more than one matching child.

```jsx
import React from 'react';
import { Router, Link } from 'react-easy-stack';
import { ProfilePage, SettingsPage } from './pages';

export default () => (
  <Router defaultPage="profile">
    <ProfilePage page="profile" />
    <SettingsPage page="settings" />
  </Router>
);
```

- Every direct `Router` child must have a `page` attribute.
- `page` attributes must be a unique string tokens without the `/` character.
- `Routers` must have a `defaultPage` prop, which matches with a child's `page`. If the relevant pathname token is empty, the Router routes to the default page.

## Links

Links update the url and navigate between the router pages.

```jsx
import React from 'react';
import { Router, Link } from 'react-easy-stack';

const ProfilePage = () => <h3>Profile Page</h3>;
const SettingsPage = () => <h3>Settings Page</h3>;

export default () => (
  <div>
    <Link to="profile">Profile</Link>
    <Link to="settings">Settings</Link>
    <Router defaultPage="profile">
      <ProfilePage page="profile" />
      <SettingsPage page="settings" />
    </Router>
  </div>
);
```

<div id="links-demo"></div>

In the simplest case the url pathname is replaced with the Link's `to` prop on click and the Router updates to match with the new pathname.

## Programmatic routing

Routing can also be triggered by the `route()` function, which takes an options object with the same properties as the `Link` component.

```jsx
import React from 'react';
import { Router, route } from 'react-easy-stack';

const ProfilePage = () => <h3>Profile Page</h3>;
const SettingsPage = () => <h3>Settings Page</h3>;

const routeToProfile = () => route({ to: 'profile' });
const routeToSettings = () => route({ to: 'profile' });

export default () => (
  <div>
    <span onClick={routeToProfile}>Profile</span>
    <span onClick={routeToSettings}>Settings</span>
    <Router defaultPage="profile">
      <ProfilePage page="profile" />
      <SettingsPage page="settings" />
    </Router>
  </div>
);
```

## The `push` option

Links and the `route` function have a `push` boolean option, which toggles if the routing should push a new history item or replace the current one. By default it adds a new history item when the routing results in a new page.

```jsx
<Link to="path" push={false} />;
// OR ...
route({ to: 'path', push: false });
```
