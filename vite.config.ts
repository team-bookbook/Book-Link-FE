import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/shared/assets/icons')],
        symbolId: 'icon-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@layouts': path.resolve(__dirname, 'src/shared/layouts'),
        '@apis': path.resolve(__dirname, 'src/shared/apis'),
        '@styles': path.resolve(__dirname, 'src/shared/styles'),
        '@components': path.resolve(__dirname, 'src/shared/components'),
        '@libs': path.resolve(__dirname, 'src/shared/libs'),
        '@constants': path.resolve(__dirname, 'src/shared/constants'),
        '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
        '@routes': path.resolve(__dirname, 'src/shared/routes'),
        '@images': path.resolve(__dirname, 'src/shared/assets/images'),
        '@icons': path.resolve(__dirname, 'src/shared/assets/icons'),
        '@types': path.resolve(__dirname, 'src/shared/types'),
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
