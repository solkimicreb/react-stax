import React from 'react'
import { view, Link } from 'react-stax'

export default view(() => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className="nav-link active" to="/home">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/edit">
              <i className="ion-compose" />
              &nbsp;New Post
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/settings">
              <i className="ion-gear-a" />
              &nbsp;Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
})
