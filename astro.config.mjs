import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import matthiesenxyzlace from '@matthiesenxyz/astrolace';

// https://astro.build/config
export default defineConfig({
  image: { domains: ['cmiworld.org'] },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    icon(),
    matthiesenxyzlace(),
  ],
});
