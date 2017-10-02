import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';
import Popper from 'popper.js';


window.jQuery = $;
window.Popper = Popper;
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css')

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();