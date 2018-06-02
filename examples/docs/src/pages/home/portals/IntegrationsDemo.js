import React from 'react';
import { view, params } from 'react-easy-stack';

const updateFilter = ev => (params.filter = ev.target.value);

export default view(() => (
  <input value={params.filter || ''} onChange={updateFilter} />
));
