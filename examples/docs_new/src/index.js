import React from 'react';
import ReactDOM from 'react-dom';
import 'github-markdown-css';
import 'prismjs/themes/prism.css';
import 'web-animations-js';
import 'whatwg-fetch';
import './instrumentScroll';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

window.renderApp = function renderApp() {
  ReactDOM.render(<App />, document.getElementById('root'));
};
const landed = localStorage.getItem('landed');
if (landed) {
  window.renderApp();
}

registerServiceWorker();
