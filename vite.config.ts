import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Explicitly define process.env.API_KEY.
      // We check the .env file first, but fall back to the provided key to ensure it works immediately.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "AIzaSyAl3PFnwdhr8jNXOiOFCoxEpNaTq05QUX4"),
    },
    server: {
      host: true
    }
  };
});