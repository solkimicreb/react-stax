import 'web-animations-js/web-animations-next.min.js'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css'
import './code.css'
import './markdown.css'
import './instrumentScroll'
import './init'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

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
