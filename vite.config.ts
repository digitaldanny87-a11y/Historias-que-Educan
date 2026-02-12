import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { cwd } from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the GenAI SDK
      // Prioritize process.env (Vercel system vars) then loaded env file
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || '')
    }
  };
});