# Routing

Easy-stack clearly separates navigation from dynamic routing parameters. The url pathname is used for navigation in the empty app shell and it can not store any parameters. It is similar to most file systems.

Dynamic parameters are stored in the query string and they ideally define the data shell for the current screen. The data shell is a minimal set of primitives, which defines the currently displayed data. It usually consists of user inputs.

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

* Every direct `Router` child must have a `page` attribute.
* `page` attributes must be a unique token without the `/` character.
* The `Router` must have a `defaultPage` prop, which matches with a child page. If the relevant pathname token is empty, the Router routes to the default page.

## Links

Links update the url and navigate between the router pages.

```jsx
import React from 'react';
import { Router, Link } from 'react-easy-stack';

const ProfilePage = () => <h2>Profile Page</h2>;
const SettingsPage = () => <h2>Settings Page</h2>;

export default () => (
  <div>
    <Link to="profile">Profile</Link>
    <Link to="settings">Settings</Link>
    <Router defaultPage="profile">
      <ProfilePage page="profile" />
      <SettingsPage page="settings" />
    </Router>
  </div>
```

<div id="links-demo"></div>

In the simplest case the url pathname is replaced with the Link's `to` prop on click and the Routers update to match with the new pathname.

## Programmatic routing

Routing can also be triggered by the `route()` function, which takes an options object with the same properties as the `Link` component.

```jsx
import React from 'react';
import { Router, route } from 'react-easy-stack';

const ProfilePage = () => <h2>Profile Page</h2>;
const SettingsPage = () => <h2>Settings Page</h2>;

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

The `route` function comes handy when you need to trigger routings not just on click events.

## The `push` options

Links and the `route` function have a `push` boolean option property, which toggles if the routing should push a new history item or replace the current one. By default it adds a new history item, except when the routing reloads the current page.

```jsx
<Link to="path" push={false} />;
// OR ...
route({ to: 'path', push: false });
```
