import React from "react";

export default function render({ view, store }) {
  const counter = store({ num: 0 });
  return view(() => <p>The num is {counter.num}</p>);
}
