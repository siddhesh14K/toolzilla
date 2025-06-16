import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Optimize dependencies
  optimizeDeps: {
    exclude: ['lucide-react'],
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
    target: 'esnext',
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
          'react-vendor': ['react', 'react-dom'],
          'pdf-tools': ['jspdf', 'pdfjs-dist', 'pdf-lib'],
          'chart-tools': ['chart.js', 'react-chartjs-2'],
          'ffmpeg-tools': ['@ffmpeg/ffmpeg', '@ffmpeg/util']
        }
      }
    },
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000
  },

  // Server configuration
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },

  // Preview configuration
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
