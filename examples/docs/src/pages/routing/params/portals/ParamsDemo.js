import React from "react";

export default function render({ Link, Router, params }) {
  const users = { "1": "Ann", "12": "Bob" };
  const getNextUser = () => params.id++;

  const UsersPage = () => (
    <div>
      <h2>User List</h2>
      {Object.keys(users).map(id => (
        <div key={id}>
          <Link to="/details" params={{ id }}>
            {users[id]}
          </Link>
        </div>
      ))}
    </div>
  );
  const DetailsPage = () => (
    <p>
      User: {users[params.id]}
      <button onClick={getNextUser}>Get next user</button>
    </p>
  );

  return () => (
    <Router defaultPage="users">
      <UsersPage page="users" />
      <DetailsPage page="details" />
    </Router>
  );
}
