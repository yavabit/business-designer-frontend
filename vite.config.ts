import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@app': path.resolve(__dirname, './src/app'),
      '@store': path.resolve(__dirname, './src/store'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@type': path.resolve(__dirname, './src/shared/types'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@contexts': path.resolve(__dirname, './src/shared/contexts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@data': path.resolve(__dirname, './src/shared/data/index'),
    }
  },
  server: {
    open: true,
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    target: 'esnext',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
          'utils-vendor': ['lodash', 'dayjs'],
          'flow-vendor': ['@xyflow/react'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
