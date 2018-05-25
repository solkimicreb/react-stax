import React from 'react';
import { view, store, params, Router, Link } from 'react-easy-stack';

const repos = store({
  list: [],
  selected: {}
});

const updateFilter = ev => (params.filter = ev.target.value);
const fetchRepos = () =>
  repos.list.push({ name: params.filter, id: params.filter });
// fetch by id
const fetchRepo = () => (repos.selected = { name: params.filter });

const List = view(() => (
  <div>
    <input value={params.filter} onChange={updateFilter} />
    <button onClick={fetchRepos}>Search</button>
    {repos.list.map(repo => (
      <Link to="details" key={repo.id}>
        {repo.name}
      </Link>
    ))}
  </div>
));

const Details = view(() => <p>{JSON.stringify(repos.selected)}</p>);

async function onRoute({ toPage }) {
  if (toPage === 'list') {
    await fetchRepos();
  } else if (toPage === 'details') {
    await fetchRepo();
  }
}

export default () => (
  <Router defaultPage="list" onRoute={onRoute}>
    <List page="list" />
    <Details page="details" />
  </Router>
);
