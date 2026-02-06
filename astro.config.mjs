// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.rpidev.com',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/legal') &&
        !page.includes('/privacy') &&
        !page.includes('/cookies'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
