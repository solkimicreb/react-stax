import React from "react";

export default function render({ Link, Router }) {
  const ProfilePage = () => <h3>Profile Page</h3>;
  const SettingsPage = () => <h3>Settings Page</h3>;

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
