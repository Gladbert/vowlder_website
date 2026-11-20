import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// ponytail: hardcoded fallback site URL so og:image is absolute in the static HTML
// (WhatsApp crawler needs absolute URLs). Override with SITE_URL when a real domain lands.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://vowlder.com',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
