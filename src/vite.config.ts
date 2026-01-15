import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'recharts'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: [],
  },
  resolve: {
    // Prevent Vite from trying to resolve server-side files
    alias: {
      // Explicitly prevent resolution of supabase server functions
    },
  },
  server: {
    fs: {
      // Don't serve files from supabase directory
      deny: ['**/supabase/**'],
    },
  },
});