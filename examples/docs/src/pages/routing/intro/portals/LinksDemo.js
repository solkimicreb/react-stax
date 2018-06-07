import React from 'react';

export default function render({ Link, Router }) {
  const ProfilePage = () => <h2>Profile Page</h2>;
  const SettingsPage = () => <h2>Settings Page</h2>;

  return () => (
    <div>
      <Link to="profile">Profile</Link>
      <Link to="settings">Settings</Link>
      <Router defaultPage="profile">
        <ProfilePage page="profile" />
        <SettingsPage page="settings" />
      </Router>
    </div>
  );
}
