import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Link } from 'react-easy-stack/dist/node.es.es5';

export default () => (
  <div>
    <Link to="list">List Link</Link>
    <Link to="details">Details Link</Link>
    <Router defaultPage="list">
      <div page="list">List Page</div>
      <div page="details">Details Page</div>
    </Router>
  </div>
);
