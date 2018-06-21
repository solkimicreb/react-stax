import React from 'react';

export default function render({ Link, Router, params, view, store }) {
  const users = store({ '1': 'Ann', '12': 'Bob' });
  const onChange = ev => (params.filter = ev.target.value);

  const UsersPage = view(() => (
    <div>
      <h3>User List</h3>
      Filter: <input value={params.filter} onChange={onChange} />
      {Object.keys(users)
        .filter(
          id =>
            !params.filter ||
            users[id].toLowerCase().indexOf(params.filter.toLowerCase()) !== -1
        )
        .map(id => (
          <div key={id}>
            <Link to="/details" params={{ id }}>
              {users[id]}
            </Link>
          </div>
        ))}
    </div>
  ));
  const DetailsPage = () => <p>User: {users[params.id]}</p>;

  return () => (
    <Router defaultPage="users">
      <UsersPage page="users" />
      <DetailsPage page="details" />
    </Router>
  );
}
