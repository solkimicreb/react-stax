import React from 'react'
import { view } from 'react-easy-stack'

function UserPage ({ id, created, karma, about, isLoading }) {
  console.log('RENDER USER', id)
  return (
    <div>
      <p>LOADING: {isLoading}</p>
      <p>user: {id}</p>
      <p>created: {created}</p>
      <p>karma: {karma}</p>
      <p>
        about: <span dangerouslySetInnerHTML={{ __html: about }} />
      </p>
    </div>
  )
}

export default view(UserPage)
