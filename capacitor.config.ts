
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ed388fd048034ecb8c37a3b808d880f6',
  appName: 'amoura-spark-romance',
  webDir: 'dist',
  server: {
    url: 'https://ed388fd0-4803-4ecb-8c37-a3b808d880f6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    }
  }
};

export default config;
