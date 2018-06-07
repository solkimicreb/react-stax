# Nested Routing

Routers can be nested to arbitrary levels and each of them is assigned a depth based on the nesting. Every router uses the url pathname token at its depth for the routing process.

```jsx
const ProfilePage = () => <h2>Profile Page</h2>;
const SettingsPage = () => (
  <div>
    <h2>Settings Page</h2>
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

Absolute links trigger a routing from the root level, while relative links only route from the current depth. The following `to` property formats can be used for relative and absolute links.

* `/settings/privacy` is an absolute link, which always routes from the root level.
* `settings/privacy` is a relative link from the current depth.
* `./settings/privacy` is also a relative link from the current depth.
* `../settings/privacy` is a relative link, which routes from the parent level.
* `../../settings/privacy` is a relative link, which routes from the grandparent level.

The system is based on file systems and HTML links.

```jsx
const ProfilePage = () => <h2>Profile Page</h2>;
const SettingsPage = () => (
  <div>
    <h2>Settings Page</h2>
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
    <Router defaultPage="profile">
      <ProfilePage page="profile" />
      <SettingsPage page="settings" />
    </Router>
  </div>
);
```

<div id="relative-demo"></div>

Using relative links instead of absolute ones is usually a good practice. It makes refactoring easier when the project grows.
