import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zimpen.disposisi',
  appName: 'Zimpen E-Disposisi',
  webDir: 'frontend/build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
