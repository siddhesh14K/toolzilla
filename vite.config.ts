import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      }
    }
  ],

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
    ],
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] // Exclude FFmpeg from optimization
  },

  // Build configuration
  build: {
    target: 'es2015',
    minify: 'terser',
    assetsInlineLimit: 0, // Don't inline large files
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split FFmpeg into a separate chunk
          ffmpeg: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
          // Split other large dependencies
          pdf: ['pdf-lib', 'pdfjs-dist', 'jspdf'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  },

  // Public directory configuration
  publicDir: 'public',
  
  // Server configuration
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
});
