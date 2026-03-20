import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // ✅ Correct way to load env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/FreshCart/',

    optimizeDeps: {
      exclude: ['lucide-react'],
    },

    server: {
      hmr: {
        overlay: false,
      },
      watch: {
        usePolling: false,
        interval: 100,
      },
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            lucide: ['lucide-react'],
          },
        },
      },

      // ✅ keep this (since you installed terser earlier)
      minify: 'terser',

      sourcemap: false,
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
});