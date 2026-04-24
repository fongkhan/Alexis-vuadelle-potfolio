// @ts-check
console.log(">> [CONFIG] ASTRO CONFIG LOADED - SSR MODE (SERVER) IS ACTIVE");
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

import { fileURLToPath, URL } from 'url';

// https://astro.build/config
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  site: 'https://alexis-vuadelle.com',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  image: {
    domains: ['localhost']
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      preserveSymlinks: true
    }
  }
});