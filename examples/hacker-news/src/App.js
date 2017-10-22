import React, { Component } from 'react'
import { easyComp, Link } from 'react-easy-stack'
import AppRouter from './AppRouter'
import { TYPES } from './config'
import './style.css'

function App () {
  return (
    <div>
      <nav>
        {TYPES.map(
          type => <Link to="/stories" params={{ type }} key={type}>{type}</Link>
        )}
      </nav>
      <AppRouter />
    </div>
  )
}

export default easyComp(App)
