/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Generates robots.txt at build time so the Sitemap line points to the real site URL.
 * The sitemap itself is served dynamically by the backend (/sitemap.xml) from published projects.
 */
function robotsTxt(siteUrl: string): Plugin {
  return {
    name: 'robots-txt',
    generateBundle() {
      const lines = ['User-agent: *', 'Allow: /', 'Disallow: /admin'];
      if (siteUrl) lines.push('', `Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml`);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: lines.join('\n') + '\n' });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_DEV_API_PROXY || 'http://localhost:8080';
  const siteUrl = env.VITE_SITE_URL || '';

  return {
    plugins: [
      react(),
      robotsTxt(siteUrl),
      {
        name: 'html-site-url',
        transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl.replace(/\/$/, '')),
      },
    ],
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/sitemap.xml': { target: apiTarget, changeOrigin: true },
      },
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            query: ['@tanstack/react-query', 'axios'],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  };
});
