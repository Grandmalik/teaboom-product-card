import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  // Относительные пути: сборка открывается из любой подпапки (GitHub Pages, локальный сервер).
  base: './',
  resolve: {
    alias: {
      // Путь к ресурсам не зависит от того, в какой папке лежит файл: url('@/assets/...').
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
