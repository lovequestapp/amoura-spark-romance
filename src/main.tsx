
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { applyBrowserSpecificFixes } from './utils/browser.ts'

// Apply browser-specific fixes before rendering
applyBrowserSpecificFixes();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
