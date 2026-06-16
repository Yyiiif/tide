import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.emma.reflow',
  appName: 'Reflow',
  webDir: 'dist',
  server: {
    url: 'https://tide-taupe.vercel.app',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
