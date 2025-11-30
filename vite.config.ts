import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We cast process to any to avoid TypeScript errors since we removed @types/node
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Expose API_KEY to the client for Netlify/Vercel
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});