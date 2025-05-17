
import { Capacitor } from '@capacitor/core';

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

export const hasNotch = (): boolean => {
  // Basic detection for devices that might have a notch
  const iOS = isIOS();
  if (iOS) {
    // iOS detection based on model/screen dimensions
    const windowWidth = window.screen.width;
    const windowHeight = window.screen.height;
    return (windowWidth === 375 && windowHeight === 812) || // iPhone X, XS, 11 Pro
           (windowWidth === 414 && windowHeight === 896) || // iPhone XR, XS Max, 11, 11 Pro Max
           (windowWidth === 390 && windowHeight === 844) || // iPhone 12, 12 Pro, 13, 13 Pro
           (windowWidth === 428 && windowHeight === 926);   // iPhone 12 Pro Max, 13 Pro Max
  }
  // For Android, we can check for display cutout API (not perfect but a starting point)
  return false;
};

export const getStatusBarHeight = (): number => {
  if (isIOS()) {
    // Approximate values for iOS devices with notches
    if (hasNotch()) {
      return 44; // taller status bar for devices with notch
    } 
    return 20; // standard iOS status bar height
  }
  
  if (isAndroid()) {
    // On Android, status bar height can vary, typical values range from 24-32dp
    return 24;
  }
  
  return 0; // web platform
};

export const getSafeAreaInsets = () => {
  if (isNativePlatform()) {
    return {
      top: hasNotch() ? getStatusBarHeight() : 0,
      bottom: hasNotch() ? 34 : 0, // Bottom home indicator area on notched iOS devices
      left: 0,
      right: 0
    };
  }
  
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
};
