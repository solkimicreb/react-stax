import React from 'react';

export default function render({ view, store }) {
  const user = store({
    firstName: 'Developer',
    lastName: 'Dan',
    get fullName() {
      return `${user.firstName} ${user.lastName}`;
    }
  });

  const onChange = ev => (user[ev.target.name] = ev.target.value);

  return view(() => (
    <div>
      <input name="firstName" value={user.firstName} onChange={onChange} />
      <input name="lastName" value={user.lastName} onChange={onChange} />
      <p>Full name is: {user.fullName}</p>
    </div>
  ));
}
