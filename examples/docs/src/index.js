import React from 'react';
import ReactDOM from 'react-dom';
import 'github-markdown-css';
import 'prismjs/themes/prism.css';
import 'web-animations-js';
import 'whatwg-fetch';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
