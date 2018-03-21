import React from 'react'
import ReactDOM from 'react-dom'
import { params } from 'react-easy-state'
import './index.css'
import App from './App'
import appStore from './appStore'

appStore.fetchBeers(params.filter)
ReactDOM.render(<App />, document.getElementById('root'))
