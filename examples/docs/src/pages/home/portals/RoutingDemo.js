import React from "react";
import ReactDOM from "react-dom";

export default function render({ Link, Router }) {
  return () => (
    <div>
      <Link to="list">List Link</Link>
      <Link to="details">Details Link</Link>
      <Router defaultPage="list">
        <div page="list">List Page</div>
        <div page="details">Details Page</div>
      </Router>
    </div>
  );
}
