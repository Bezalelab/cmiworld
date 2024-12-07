import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import robots from 'astro-robots'
import { defineConfig } from 'astro/config'
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
    sitemap(),
    robots(),
  ],
});
