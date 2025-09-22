import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@apis': path.resolve(__dirname, 'src/shared/apis'),
      '@styles': path.resolve(__dirname, 'src/shared/styles'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
      '@libs': path.resolve(__dirname, 'src/shared/libs'),
      '@constants': path.resolve(__dirname, 'src/shared/constants'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@routes': path.resolve(__dirname, 'src/shared/routes'),
      '@img': path.resolve(__dirname, 'src/shared/assets/images'),
      '@svg': path.resolve(__dirname, 'src/shared/assets/svgs'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
