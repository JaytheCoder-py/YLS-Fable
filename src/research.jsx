import React from 'react';
import { createRoot } from 'react-dom/client';
import ResearchApp from './ResearchApp.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResearchApp />
  </React.StrictMode>
);
