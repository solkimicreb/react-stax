import React from "react";

export default function render({ view, params }) {
  params.filter = params.filter || "potato";
  const updateFilter = ev => (params.filter = ev.target.value);
  return view(() => <input value={params.filter} onChange={updateFilter} />);
}
