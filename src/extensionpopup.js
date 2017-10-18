import './extensionpopup.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './App';
import NotificationService from "./services/NotificationService";
import React from 'react';
import ReactDOM from 'react-dom';

NotificationService.clearAll();
ReactDOM.render(<App />, document.getElementById('root'));