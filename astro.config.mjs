// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Required for sitemap generation - replace with your actual domain
  site: 'https://example.com',

  integrations: [
    vue({
      // Points to the Vue/Quasar initialization file
      appEntrypoint: '/src/vue-setup.ts',
      // Enable JSX support (optional)
      jsx: true
    }),
    // Generates sitemap-index.xml at build time
    sitemap()
  ],

  vite: {
    resolve: {
      // Prevents duplicate Vue instances across islands
      dedupe: ['vue']
    }
  }
});
