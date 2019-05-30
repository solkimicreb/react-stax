import React from "react";
import { view } from "react-stax";

export default view(() => {
  return (
    <footer>
      <div className="container">
        <a href="/" className="logo-font">
          conduit
        </a>
        <span className="attribution">
          An interactive learning project from{" "}
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  );
});
