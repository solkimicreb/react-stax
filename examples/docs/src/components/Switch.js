import React from 'react';
import { Router } from 'react-easy-stack';

export default ({ page, children, isDefault, ...props }) => (
  <Router {...props} defaultPage={isDefault ? page : undefined}>
    <div page={page}>{children}</div>
  </Router>
);
