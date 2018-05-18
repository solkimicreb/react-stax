import React from "react";
import { view } from "react-easy-stack";

function UserPage({ user }) {
  const { id, created, karma, about, isLoading } = user;
  return (
    <div>
      <p>{isLoading && "LOADING"}</p>
      <p>user: {id}</p>
      <p>created: {created}</p>
      <p>karma: {karma}</p>
      <p>
        about: <span dangerouslySetInnerHTML={{ __html: about }} />
      </p>
    </div>
  );
}

export default view(UserPage);
