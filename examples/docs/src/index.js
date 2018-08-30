import 'web-animations-js/web-animations-next.min.js'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { session } from 'react-stax'
import './reset.css'
import './code.css'
import './markdown.css'
import './instrumentScroll'
import App from './App'
import * as routes from './routes'
import registerServiceWorker from './registerServiceWorker'

Object.assign(session, routes.all[0])

const app = document.getElementById('root')

window.renderApp = function renderApp() {
  ReactDOM.render(<App />, app)
  app.style.opacity = 1
}

const landed = localStorage.getItem('landed')
if (landed) {
  app.style.transition = null
  window.renderApp()
}

registerServiceWorker()
