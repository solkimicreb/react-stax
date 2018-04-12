import React from 'react';
import { Router } from 'react-easy-stack';

export default ({ page, children, ...props }) => (
  <Router {...props}>
    <div page={page}>{children}</div>
  </Router>
);
