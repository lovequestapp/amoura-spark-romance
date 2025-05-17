
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { applyBrowserSpecificFixes } from './utils/browser.ts'
import { Capacitor } from '@capacitor/core'

// Apply browser-specific fixes before rendering
applyBrowserSpecificFixes();

// Add mobile-specific adjustments
const addMobileSpecificClasses = () => {
  if (Capacitor.isNativePlatform()) {
    document.body.classList.add('capacitor-platform');
    
    // Add iOS specific class
    if (Capacitor.getPlatform() === 'ios') {
      document.body.classList.add('ios-platform');
    } 
    // Add Android specific class
    else if (Capacitor.getPlatform() === 'android') {
      document.body.classList.add('android-platform');
    }
  }
};

// Initialize mobile-specific configurations
addMobileSpecificClasses();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
