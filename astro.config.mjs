import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import matthiesenxyzlace from '@matthiesenxyz/astrolace';
import sitemap from '@astrojs/sitemap';
import robots from 'astro-robots';
// https://astro.build/config
export default defineConfig({
  site: 'https://cmiworld.org',
  image: {
    remotePatterns: [
      {
        protocol: 'https',
      },
    ],
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    icon(),
    matthiesenxyzlace(),
    sitemap(),
    robots(),
  ],
});
