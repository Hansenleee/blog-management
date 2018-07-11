import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/app';
import { BrowserRouter as Router, } from 'react-router-dom';
import 'antd/dist/antd.css';
import './assets/style/app.styl';
import registerServiceWorker from './registerServiceWorker';
import './plugins';

ReactDOM.render(
  <Router>
    <App/>
  </Router>, 
  document.getElementById('root')
);
registerServiceWorker();
