import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'jspdf',
      'pdfjs-dist',
      'pdf-lib',
      'chart.js',
      'react-chartjs-2'
    ]
  },

  // Build configuration
  build: {
    target: 'es2015', // Changed from esnext for better browser compatibility
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'pdf': ['jspdf', 'pdfjs-dist', 'pdf-lib'],
          'chart': ['chart.js', 'react-chartjs-2'],
          'media': ['@ffmpeg/ffmpeg', '@ffmpeg/util']
        }
      }
    },
    sourcemap: true, // Enable sourcemaps for debugging
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs']
    }
  },

  // Server configuration
  server: {
    port: 3000,
    host: true,
    fs: {
      strict: true
    }
  },

  // Preview configuration
  preview: {
    port: 3000,
    host: true
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
