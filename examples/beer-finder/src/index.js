import React from 'react'
import ReactDOM from 'react-dom'
import { params } from 'react-easy-stack'
import './index.css'
import App from './App'
import appStore, { fetchBeers } from './appStore'

fetchBeers(params.filter)
ReactDOM.render(<App />, document.getElementById('root'))
