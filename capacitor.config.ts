import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kycapp.app',
  appName: 'KYC App',
  webDir: 'out',
  server: {
    url: "https://kyc-dashboard-nu.vercel.app/dashboard", 
    cleartext: false,
  },
};

export default config;
