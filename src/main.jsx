import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { bootstrap } from './lib/storage.js';
import { applyTheme } from './lib/theme.js';
import './styles/index.css';

applyTheme();    // before render — no FOUC
bootstrap();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
