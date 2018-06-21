# Nested Routing

Routers can be nested to arbitrary levels and each of them is assigned a depth based on the nesting. Every router uses the url pathname token at its depth for the routing process.

```jsx
const ProfilePage = () => <h3>Profile Page</h3>;
const SettingsPage = () => (
  <div>
    <h3>Settings Page</h3>
    <Link to="account">Account</Link>
    <Link to="privacy">Privacy</Link>
    <Router defaultPage="account">
      <p page="account">Account Settings</p>
      <p page="privacy">Privacy Settings</p>
    </Router>
  </div>
);

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

<div id="nested-demo"></div>

## Relative and absolute links

Absolute links trigger a routing from the root level, while relative links only route from the `Link`'s depth. The `to` property format is mirroring the behavior of [file systems](http://teaching.idallen.com/cst8207/12f/notes/160_pathnames.html) and [HTML links](https://www.w3schools.com/html/html_filepaths.asp) for absolute and relative paths.

- `/settings/privacy` is an absolute link, which always routes from the root level.
- `settings/privacy` is a relative link from the current depth.
- `./settings/privacy` is also a relative link from the current depth.
- `../settings/privacy` is a relative link, which routes from the parent level.
- `../../settings/privacy` is a relative link, which routes from the grandparent level.
- `..` is a relative link, which routes to the default page of the parent router.
- Having no `path` at all reloads the current page.

```jsx
const ProfilePage = () => <h3>Profile Page</h3>;
const SettingsPage = () => (
  <div>
    <h3>Settings Page</h3>
    <Link to="account">Account</Link>
    <Link to="privacy">Privacy</Link>
    <Link to="/profile">Back to Profile (absolute)</Link>
    <Link to="../profile">Back to Profile (relative)</Link>
    <Router defaultPage="account">
      <p page="account">Account Settings</p>
      <p page="privacy">Privacy Settings</p>
    </Router>
  </div>
);

export default () => (
  <div>
    <Link to="/profile">Profile</Link>
    <Link to="/settings">Settings</Link>
    <Link to="/settings/privacy">Privacy Settings</Link>
    <Link>Current Page</Link>
    <Router defaultPage="profile">
      <ProfilePage page="profile" />
      <SettingsPage page="settings" />
    </Router>
  </div>
);
```

<div id="relative-demo"></div>

Using relative links instead of absolute ones is usually a good practice. It makes refactoring easier when the project grows.

> Relative paths don't make sense in case of the `route()` function, it always routes from the root level.
