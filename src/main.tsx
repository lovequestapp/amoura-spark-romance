
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

// Ensure the app renders properly
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Add error boundary to catch render errors
const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Error rendering app:', error);
  // Fallback render without StrictMode
  root.render(<App />);
}
