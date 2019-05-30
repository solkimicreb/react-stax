import React from "react";

export default function render({ Link, Router }) {
  function onRoute({ fromPage, toPage }) {
    if (fromPage) {
      alert(`Routing from ${fromPage} to ${toPage}`);
    }
  }

  return () => (
    <div>
      <Link to="profile">Profile Page</Link>
      <Link to="settings">Settings Page</Link>
      <Router defaultPage="profile" onRoute={onRoute}>
        <h3 page="profile">Profile Page</h3>
        <h3 page="settings">Settings Page</h3>
      </Router>
    </div>
  );
}
