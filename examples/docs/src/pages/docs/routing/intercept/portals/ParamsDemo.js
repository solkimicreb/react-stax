import React from "react";

export default function render({ Link, Router, params }) {
  function onRoute({ toPage }) {
    if (toPage === "list") {
      params.filter = params.filter || "green";
    }
  }

  return () => (
    <div>
      <Link to="list">List</Link>
      <Link to="list" params={{ filter: "red" }}>
        Red List
      </Link>
      <Link to="details">Details</Link>
      <Router defaultPage="list" onRoute={onRoute}>
        <h3 page="list">Colors List</h3>
        <h3 page="details">Color Details</h3>
      </Router>
    </div>
  );
}
