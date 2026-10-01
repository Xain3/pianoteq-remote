import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '../..', 'PTQ_');
  const port = process.env.PTQ_API_PORT ?? environment.PTQ_API_PORT ?? '8787';
  return {
    envDir: '../..',
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
        manifest: {
          name: 'Pianoteq Remote',
          short_name: 'PTQ Remote',
          description: 'A simple instrument controller for your Pianoteq host.',
          start_url: '/',
          display: 'standalone',
          background_color: '#f5f3ee',
          theme_color: '#234d43',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
          navigateFallbackDenylist: [/^\/api\//],
          // No API caching, background sync, or offline command replay.
          runtimeCaching: [],
        },
      }),
    ],
    server: {
      port: 5173,
      strictPort: true,
      proxy: { '/api': { target: `http://127.0.0.1:${port}`, changeOrigin: false } },
    },
  };
});
