Easy Stack clearly separates page navigation from <span id='params-link'> dynamic routing parameters</span>. The url pathname is used for navigation in the [application shell](https://developers.google.com/web/fundamentals/architecture/app-shell) while the query string stores the data shell for the current page. The data shell is a minimal set of dynamic primitives, which define the current application state. It usually consists of user inputs.

## The Router component

The `Router` component checks the url pathname token at the appropriate depth and renders its child with the matching `page` attribute. Router children may be components or simple HTML elements.

```jsx
import React from 'react';
import { Router, Link } from 'react-stax';
import { ProfilePage, SettingsPage } from './pages';

export default () => (
  <Router defaultPage="profile">
    <ProfilePage page="profile" />
    <SettingsPage page="settings" />
  </Router>
);
```

- Every direct `Router` child must have a unique `page` attribute.
- `page` attributes must be string tokens without the `/` character.
- `Routers` must have a `defaultPage` prop, which matches with a child's `page`. If the relevant url pathname token is empty, the Router routes to the default page.

## Links

Links update the url and navigate between the router pages.

```jsx
import React from 'react';
import { Router, Link } from 'react-stax';

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

In the simplest case the url pathname is replaced with the Link's `to` prop on click and the Routers update to match with the new pathname tokens.

## Programmatic routing

Routing can also be triggered by the `route()` function, which takes an options object with the same properties as the `Link` component.

```jsx
import React from 'react';
import { Router, route } from 'react-stax';

const routeToProfile = () => route({ to: 'profile' });
const routeToSettings = () => route({ to: 'settings' });

export default () => (
  <div>
    <span onClick={routeToProfile}>Profile</span>
    <span onClick={routeToSettings}>Settings</span>
    <Router defaultPage="profile">
      <h3 page="profile">Profile Page</h3>
      <h3 page="settings">Settings Page</h3>
    </Router>
  </div>
);
```

`route()` returns a Promise, which resolves after the whole routing process is over, in case of <span id='async-link'> async routing</span>.

## The `push` option

Links and the `route()` function have a `push` boolean option, which toggles if the routing should push a new history item or replace the current one. By default it adds a new history item when the routing results in a new page.

```jsx
<Link to="path" push={false} />;
// OR ...
route({ to: 'path', push: false });
```

See the <span id='api-link'> routing API </span> for a full list of available `route()` and `Link` options.
