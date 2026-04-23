// @ts-check
console.log(">> [CONFIG] ASTRO CONFIG LOADED - SSR MODE (SERVER) IS ACTIVE");
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://alexis-vuadelle.com',
  output: 'server',
  adapter: node({
    mode: 'middleware',
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