import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // Загрузчик для JSX файлов
    include: /src\/.*\.jsx?$/, // Убедитесь, что файлы с расширениями .jsx или .js обрабатываются
    exclude: [],
  },
});
