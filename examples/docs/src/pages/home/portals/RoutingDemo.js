import React from 'react';
import ReactDOM from 'react-dom';
import { Router as R } from 'react-easy-stack';

export default async function render(node) {
  const {
    Router,
    Link
  } = await import(/* webpackChunkName: "router-demo" */ 'react-easy-stack2');
  const linkOptions = { state: { exampleId: 'router-demo' } };

  ReactDOM.render(
    <div>
      <Link to="list" options={linkOptions}>
        List Link
      </Link>
      <Link to="details" options={linkOptions}>
        Details Link
      </Link>
      <Router defaultPage="list">
        <div page="list">List Page</div>
        <div page="details">Details Page</div>
      </Router>
    </div>,
    node
  );
}
