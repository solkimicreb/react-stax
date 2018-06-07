import React from 'react';

export default function render({ Link, Router, params }) {
  const users = { '1': 'Ann', '12': 'Bob' };

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
  const DetailsPage = () => <p>User: {users[params.id]}</p>;

  return () => (
    <Router defaultPage="users">
      <UsersPage page="users" />
      <DetailsPage page="details" />
    </Router>
  );
}
