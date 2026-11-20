import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Absolute URLs are baked into the HTML at build time (WhatsApp's crawler needs them).
// Fallback is the live workers.dev host; override with SITE_URL once the domain lands.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://vowlder-website.gladbert-sogo.workers.dev',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
