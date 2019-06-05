import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { clock, App } from './App'

clock.init()
ReactDOM.render(<App />, document.getElementById('root'))
