import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cliimber.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
      // Las fuentes siempre como archivo (nunca base64 en el CSS), para que la CSP admita solo font-src 'self'.
      assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
    },
  },
});
