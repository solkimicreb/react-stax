import React from 'react'
import ReactDOM from 'react-dom'
import 'web-animations-js/web-animations-next.min.js'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './reset.css'
import './style.css'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
