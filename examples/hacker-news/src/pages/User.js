import React from "react";
import { view } from "react-stax";

export default view(({ id, created, karma, about }) => (
  <div>
    <p>user: {id}</p>
    <p>created: {created}</p>
    <p>karma: {karma}</p>
    <p>
      about: <span dangerouslySetInnerHTML={{ __html: about }} />
    </p>
  </div>
));
