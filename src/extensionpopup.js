import './extensionpopup.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './App';
import NotificationService from "./services/NotificationService";
import React from 'react';
import { render } from "react-dom";

NotificationService.clearAll();
render(<App />, document.getElementById('root'));