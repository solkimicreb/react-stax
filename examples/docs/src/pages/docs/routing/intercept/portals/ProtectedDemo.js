import React from "react";

export default function render({ Link, Router, route, view, store }) {
  const user = store({});

  function toggleLogin() {
    user.isLoggedIn = !user.isLoggedIn;
    if (!user.isLoggedIn) {
      route({ to: "public" });
    }
  }

  function onRoute({ fromPage, toPage }) {
    if (toPage === "protected" && !user.isLoggedIn) {
      alert("Please log in to view the protected page!");
      route({ to: fromPage });
    }
  }

  return view(() => (
    <div>
      <Link to="public">Public Page</Link>
      <Link to="protected">Protected Page</Link>
      <button onClick={toggleLogin}>
        Log {user.isLoggedIn ? "out" : "in"}
      </button>
      <Router defaultPage="public" onRoute={onRoute}>
        <h3 page="public">Public Page</h3>
        <h3 page="protected">Protected Page</h3>
      </Router>
    </div>
  ));
}
