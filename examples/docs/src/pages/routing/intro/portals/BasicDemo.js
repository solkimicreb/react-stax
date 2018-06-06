import React from 'react';

export default function render({ view, store, setInterval }) {
  const counter = store({ num: 0 });
  setInterval(() => counter.num++, 1000);

  return view(() => <p>The num is {counter.num}.</p>);
}
