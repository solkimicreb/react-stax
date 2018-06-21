import React from "react";

export default function render({ Link, Router }) {
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
